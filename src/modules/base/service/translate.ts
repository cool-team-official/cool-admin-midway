import { I18N } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BaseSysMenuEntity } from '../entity/sys/menu';
import {
  App,
  Config,
  ILogger,
  IMidwayApplication,
  Inject,
  Provide,
  Scope,
  ScopeEnum,
} from '@midwayjs/core';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';
import { DictInfoEntity } from '../../dict/entity/info';
import { DictTypeEntity } from '../../dict/entity/type';
/**
 * 翻译服务
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class BaseTranslateService {
  @InjectEntityModel(BaseSysMenuEntity)
  baseSysMenuEntity: Repository<BaseSysMenuEntity>;

  @InjectEntityModel(DictInfoEntity)
  dictInfoEntity: Repository<DictInfoEntity>;

  @InjectEntityModel(DictTypeEntity)
  dictTypeEntity: Repository<DictTypeEntity>;

  // 基础路径
  basePath: string;

  @App()
  app: IMidwayApplication;

  @Inject()
  logger: ILogger;

  @Config('cool.i18n')
  config: {
    /** 是否开启 */
    enable: boolean;
    /** 语言 */
    languages: string[];
    /** 翻译服务 */
    serviceUrl?: string;
  };

  menuMap: Record<string, string> = {};

  msgMap: Record<string, string> = {};

  commMap: Record<string, string> = {};

  // 添加字典映射
  dictMap: Record<string, string> = {};

  /**
   * 检查是否存在锁文件
   */
  private checkLockFile(type: 'menu' | 'msg' | 'comm'): boolean {
    const lockFile = path.join(this.basePath, type, '.lock');
    return fs.existsSync(lockFile);
  }

  /**
   * 创建锁文件
   */
  private createLockFile(type: 'menu' | 'msg' | 'comm'): void {
    const lockFile = path.join(this.basePath, type, '.lock');
    fs.writeFileSync(lockFile, new Date().toISOString());
  }

  /**
   * 加载翻译文件到内存
   */
  async loadTranslations() {
    if (!this.config?.enable) {
      return;
    }
    if (!this.basePath) {
      this.basePath = path.join(this.app.getBaseDir(), '..', this.app.getEnv() === 'local' ? 'src' : 'dist', 'locales');
    }

    // 清空现有映射
    this.menuMap = {};
    this.msgMap = {};
    this.dictMap = {};
    this.commMap = {};
    // 加载菜单翻译
    await this.loadTypeTranslations('menu', this.menuMap);

    // 加载消息翻译
    await this.loadTypeTranslations('msg', this.msgMap);

    // 加载通用消息翻译
    await this.loadTypeTranslations('comm', this.commMap);

    // 加载字典翻译
    await this.loadDictTranslations();
  }

  /**
   * 加载指定类型的翻译
   * @param type 翻译类型
   * @param map 映射对象
   */
  private async loadTypeTranslations(
    type: 'menu' | 'msg' | 'comm',
    map: Record<string, string>
  ) {
    const dirPath = path.join(this.basePath, type);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const language = file.replace('.json', '');
          const content = fs.readFileSync(path.join(dirPath, file), 'utf-8');
          const translations = JSON.parse(content);
          for (const [key, value] of Object.entries(translations)) {
            map[`${language}:${key}`] = value as string;
          }
        }
      }
    }
  }

  /**
   * 加载字典翻译
   */
  private async loadDictTranslations() {
    const dictTypes = ['info', 'type'];

    for (const dictType of dictTypes) {
      const dirPath = path.join(this.basePath, 'dict', dictType);
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
          if (file.endsWith('.json')) {
            const language = file.replace('.json', '');
            const content = fs.readFileSync(path.join(dirPath, file), 'utf-8');
            const translations = JSON.parse(content);
            for (const [key, value] of Object.entries(translations)) {
              this.dictMap[`${language}:dict:${dictType}:${key}`] =
                value as string;
            }
          }
        }
      }
    }
  }

  /**
   * 更新翻译映射
   * @param type 类型 menu | msg
   * @param language 语言
   */
  async updateTranslationMap(type: 'menu' | 'msg', language: string) {
    const dirPath = path.join(this.basePath, type);
    const file = path.join(dirPath, `${language}.json`);

    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      const translations = JSON.parse(content);
      const map = type === 'menu' ? this.menuMap : this.msgMap;

      for (const [key, value] of Object.entries(translations)) {
        map[`${language}:${key}`] = value as string;
      }
    }
  }

  /**
   * 翻译
   * @param type 类型 menu | msg | dict
   * @param language 语言
   * @param text 原文
   * @returns 翻译后的文本
   */
  translate(
    type: 'menu' | 'msg' | 'dict:info' | 'dict:type' | 'comm',
    language: string,
    text: string
  ): string {
    // 处理字典翻译
    if (type === 'dict:info' || type === 'dict:type') {
      const key = `${language}:${type}:${text}`;
      return this.dictMap[key] || text.split(':').pop() || text;
    }

    // 处理菜单和消息翻译
    const map = type === 'menu' ? this.menuMap : this.msgMap;
    const key = `${language}:${text}`;
    return map[key] || text;
  }

  /**
   * 检查翻译
   */
  async check() {
    if (this.config?.enable && this.app.getEnv() == 'local') {
      this.basePath = path.join(this.app.getBaseDir(), '..', 'src', 'locales');
      const menuLockExists = this.checkLockFile('menu');
      const msgLockExists = this.checkLockFile('msg');
      const commLockExists = this.checkLockFile('comm');
      const dictLockExists = this.checkDictLockFile();

      if (
        !menuLockExists ||
        !msgLockExists ||
        !dictLockExists ||
        !commLockExists
      ) {
        const tasks = [];
        if (!msgLockExists) {
          tasks.push(this.genBaseMsg());
        }
        if (!menuLockExists) {
          tasks.push(this.genBaseMenu());
        }
        if (!dictLockExists) {
          tasks.push(this.genBaseDict());
        }
        if (!commLockExists) {
          tasks.push(this.genCommMsg());
        }
        // 启动旋转动画
        const spinner = ['|', '/', '-', '\\'];
        let index = 0;
        const interval = setInterval(() => {
          process.stdout.write(`\r${spinner[index++]} i18n translate...`);
          index %= spinner.length;
        }, 200);
        try {
          await Promise.all(tasks);
        } finally {
          clearInterval(interval);
          // 加载翻译文件到内存
          await this.loadTranslations();
          await this.loadDictTranslations();
          process.stdout.write('\r✅ i18n translate success！！！\n');
        }
      } else {
        this.logger.debug('Translation lock files exist, skipping translation');
        // 直接加载翻译文件到内存
        await this.loadTranslations();
        await this.loadDictTranslations();
      }
    }
  }

  /**
   * 检查字典锁文件
   */
  private checkDictLockFile(): boolean {
    const lockFile = path.join(this.basePath, 'dict', '.lock');
    return fs.existsSync(lockFile);
  }

  /**
   * 创建字典锁文件
   */
  private createDictLockFile(): void {
    const lockFile = path.join(this.basePath, 'dict', '.lock');
    fs.writeFileSync(lockFile, new Date().toISOString());
  }

  /**
   * 生成基础字典
   */
  async genBaseDict() {
    try {
      // 检查是否存在锁文件
      if (this.checkDictLockFile()) {
        this.logger.debug('Dictionary lock file exists, skipping translation');
        return;
      }

      const infos = await this.dictInfoEntity.find();
      const types = await this.dictTypeEntity.find();

      // 确保目录存在
      const infoDir = path.join(this.basePath, 'dict', 'info');
      const typeDir = path.join(this.basePath, 'dict', 'type');
      fs.mkdirSync(infoDir, { recursive: true });
      fs.mkdirSync(typeDir, { recursive: true });

      // 生成中文基础文件
      const infoContent = {};
      const typeContent = {};

      for (const info of infos) {
        infoContent[info.name] = info.name;
      }
      for (const type of types) {
        typeContent[type.name] = type.name;
      }

      const infoFile = path.join(infoDir, 'zh-cn.json');
      const typeFile = path.join(typeDir, 'zh-cn.json');

      const infoText = JSON.stringify(infoContent, null, 2);
      const typeText = JSON.stringify(typeContent, null, 2);

      fs.writeFileSync(infoFile, infoText);
      fs.writeFileSync(typeFile, typeText);

      this.logger.debug('Base dictionary files generated successfully');

      // 翻译其他语言
      if (this.config?.enable && this.config.languages) {
        const translatePromises = [];

        for (const language of this.config.languages) {
          if (language !== 'zh-cn') {
            // 翻译 info 字典
            translatePromises.push(
              this.invokeTranslate(infoText, language, infoDir, 'dict')
            );

            // 翻译 type 字典
            translatePromises.push(
              this.invokeTranslate(typeText, language, typeDir, 'dict')
            );
          }
        }

        await Promise.all(translatePromises);
        this.logger.debug('Dictionary translations completed successfully');
      }

      // 创建锁文件
      this.createDictLockFile();

      // 更新翻译映射
      await this.loadDictTranslations();
    } catch (error) {
      this.logger.error('Failed to generate dictionary:', error);
      throw error;
    }
  }

  /**
   * 更新字典翻译映射
   * @param language 语言
   */
  async updateDictTranslationMap(language: string) {
    const infoFile = path.join(
      this.basePath,
      'dict',
      'info',
      `${language}.json`
    );
    const typeFile = path.join(
      this.basePath,
      'dict',
      'type',
      `${language}.json`
    );

    if (fs.existsSync(infoFile)) {
      const content = fs.readFileSync(infoFile, 'utf-8');
      const translations = JSON.parse(content);
      for (const [key, value] of Object.entries(translations)) {
        this.dictMap[`${language}:dict:info:${key}`] = value as string;
      }
    }

    if (fs.existsSync(typeFile)) {
      const content = fs.readFileSync(typeFile, 'utf-8');
      const translations = JSON.parse(content);
      for (const [key, value] of Object.entries(translations)) {
        this.dictMap[`${language}:dict:type:${key}`] = value as string;
      }
    }
  }

  /**
   * 生成基础菜单
   */
  async genBaseMenu() {
    const menus = await this.baseSysMenuEntity.find();
    const file = path.join(this.basePath, 'menu', 'zh-cn.json');
    const content = {};
    for (const menu of menus) {
      content[menu.name] = menu.name;
    }
    // 确保目录存在
    const msgDir = path.dirname(file);
    if (!fs.existsSync(msgDir)) {
      fs.mkdirSync(msgDir, { recursive: true });
    }
    const text = JSON.stringify(content, null, 2);
    fs.writeFileSync(file, text);
    this.logger.debug('base menu generate success');
    const translatePromises = [];
    for (const language of this.config.languages) {
      if (language !== 'zh-cn') {
        translatePromises.push(
          this.invokeTranslate(
            text,
            language,
            path.join(this.basePath, 'menu'),
            'menu'
          )
        );
      }
    }
    await Promise.all(translatePromises);
    this.createLockFile('menu');
  }

  /**
   * 生成基础消息
   */
  async genBaseMsg() {
    const file = path.join(this.basePath, 'msg', 'zh-cn.json');
    const scanPath = path.join(this.app.getBaseDir(), '..', 'src', 'modules');
    const messages = {};

    // 递归扫描目录
    const scanDir = (dir: string) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          scanDir(fullPath);
        } else if (file.endsWith('.ts')) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const matches = content.match(
            /throw new CoolCommException\((['"])(.*?)\1\)/g
          );
          if (matches) {
            matches.forEach(match => {
              const message = match.match(/(['"])(.*?)\1/)[2];
              messages[message] = message;
            });
          }
        }
      }
    };

    // 开始扫描
    scanDir(scanPath);

    // 确保目录存在
    const msgDir = path.dirname(file);
    if (!fs.existsSync(msgDir)) {
      fs.mkdirSync(msgDir, { recursive: true });
    }

    // 写入文件
    const text = JSON.stringify(messages, null, 2);
    fs.writeFileSync(file, text);
    this.logger.debug('base msg generate success');

    const translatePromises = [];
    for (const language of this.config.languages) {
      if (language !== 'zh-cn') {
        translatePromises.push(
          this.invokeTranslate(
            text,
            language,
            path.join(this.basePath, 'msg'),
            'msg'
          )
        );
      }
    }
    await Promise.all(translatePromises);
    this.createLockFile('msg');
  }

  /**
   * 生成通用消息
   */
  async genCommMsg() {
    const file = path.join(this.basePath, 'comm', 'zh-cn.json');
    const scanPath = path.join(this.app.getBaseDir(), '..', 'src', 'modules');
    const messages = {};

    // 递归扫描目录
    const scanDir = (dir: string) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          scanDir(fullPath);
        } else if (file.endsWith('.ts')) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const matches = content.match(
            /this.translate.comm\((['"])(.*?)\1\)/g
          );
          if (matches) {
            matches.forEach(match => {
              const message = match.match(/(['"])(.*?)\1/)[2];
              messages[message] = message;
            });
          }
        }
      }
    };

    // 开始扫描
    scanDir(scanPath);

    // 确保目录存在
    const msgDir = path.dirname(file);
    if (!fs.existsSync(msgDir)) {
      fs.mkdirSync(msgDir, { recursive: true });
    }

    // 写入文件
    const text = JSON.stringify(messages, null, 2);
    fs.writeFileSync(file, text);
    this.logger.debug('base comm generate success');

    const translatePromises = [];
    for (const language of this.config.languages) {
      if (language !== 'zh-cn') {
        translatePromises.push(
          this.invokeTranslate(
            text,
            language,
            path.join(this.basePath, 'comm'),
            'comm'
          )
        );
      }
    }
    await Promise.all(translatePromises);
    this.createLockFile('comm');
  }

  /**
   * 通用消息翻译
   * @param text 文本
   * @returns 翻译后的文本对象,包含各语言的翻译
   */
  comm(text: string) {
    const translations = {};
    for (const lang of this.config.languages) {
      const langFile = path.join(this.basePath, 'comm', `${lang}.json`);
      if (fs.existsSync(langFile)) {
        const content = JSON.parse(fs.readFileSync(langFile, 'utf-8'));
        translations[lang] = content[text] || text;
      }
    }
    return translations;
  }

  /**
   * 调用翻译
   * @param text 文本
   * @param language 语言
   * @param dirPath 目录
   * @param type 类型
   * @returns
   */
  async invokeTranslate(
    text: string,
    language: string,
    dirPath: string,
    type: 'menu' | 'msg' | 'dict' | 'comm' = 'msg'
  ) {
    this.logger.debug(`${type} ${language} translate start`);
    const response = await axios.post(I18N.DEFAULT_SERVICE_URL, {
      label: 'i18n-node',
      params: {
        text,
        language,
      },
      stream: false,
    });
    const file = path.join(dirPath, `${language}.json`);
    fs.writeFileSync(file, response.data.data.result.data);
    this.logger.debug(`${type} ${language} translate success`);
  }
}
