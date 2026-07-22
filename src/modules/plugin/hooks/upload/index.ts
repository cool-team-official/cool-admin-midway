import { BaseUpload, MODETYPE } from './interface';
import { BasePluginHook } from '../base';
import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';
import { v1 as uuid } from 'uuid';
import { CoolCommException } from '@cool-midway/core';
import * as _ from 'lodash';
import { pUploadPath } from '../../../../comm/path';
import { app } from '@midwayjs/core'; // 导入app以获取配置

/**
 * 文件上传
 */
export class CoolPlugin extends BasePluginHook implements BaseUpload {
  /**
   * 验证路径安全性，防止路径遍历攻击
   * @param userInput 用户输入的文件名或路径
   * @returns 安全的文件名
   */
  private sanitizePath(userInput: string): string {
    if (!userInput) {
      return '';
    }
    // 检查是否包含路径遍历字符
    if (
      userInput.includes('..') ||
      userInput.includes('./') ||
      userInput.includes('.\\') ||
      userInput.includes('\\') ||
      userInput.includes('//') ||
      userInput.includes('\0') ||
      /^[a-zA-Z]:/.test(userInput) || // Windows绝对路径
      userInput.startsWith('/')
    ) {
      throw new CoolCommException('非法的文件路径');
    }
    // 规范化路径后再次检查
    const normalized = path.normalize(userInput);
    if (normalized.includes('..') || normalized.startsWith('/')) {
      throw new CoolCommException('非法的文件路径');
    }
    return normalized;
  }

  /**
   * 验证文件扩展名是否在允许的白名单中
   * @param filename 文件名
   * @returns 验证结果
   */
  private validateFileExtension(filename: string): boolean {
    // 从配置中获取允许的文件扩展名白名单
    const uploadConfig = app.getConfig('upload');
    const whitelist = uploadConfig?.whitelist;
    
    // 如果白名单为null或undefined，则允许所有扩展名（向后兼容）
    if (!whitelist) {
      return true;
    }
    
    // 获取文件扩展名
    const ext = path.extname(filename).toLowerCase();
    
    // 检查扩展名是否在白名单中
    return whitelist.includes(ext);
  }

  /**
   * 获取默认的文件扩展名白名单
   * @returns 默认白名单
   */
  private getDefaultWhitelist(): string[] {
    return [
      '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', // 图片
      '.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm',  // 视频
      '.mp3', '.wav', '.flac', '.aac', '.ogg',         // 音频
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', // 文档
      '.txt', '.csv', '.json', '.xml', '.zip', '.rar', '.7z'  // 其他
    ];
  }

  /**
   * 验证最终路径是否在允许的目录内
   * @param targetPath 目标路径
   * @param basePath 基础路径
   */
  private validateTargetPath(targetPath: string, basePath: string): void {
    const resolvedTarget = path.resolve(targetPath);
    const resolvedBase = path.resolve(basePath);
    if (!resolvedTarget.startsWith(resolvedBase + path.sep)) {
      throw new CoolCommException('文件路径超出允许范围');
    }
  }

  /**
   * 获得上传模式
   * @returns
   */
  async getMode() {
    return {
      mode: MODETYPE.LOCAL,
      type: MODETYPE.LOCAL,
    };
  }

  /**
   * 获得原始操作对象
   * @returns
   */
  async getMetaFileObj() {
    return;
  }

  /**
   * 下载并上传
   * @param url
   * @param fileName
   */
  async downAndUpload(url: string, fileName?: string) {
    const { domain } = this.pluginInfo.config;
    const basePath = pUploadPath();
    const dateDir = moment().format('YYYYMMDD');

    // 从url获取扩展名
    const extend = path.extname(fileName ? fileName : url);

    // 验证文件名安全性
    let safeFileName: string;
    if (fileName) {
      safeFileName = this.sanitizePath(fileName);
      // 只取文件名部分，去除可能的子目录
      safeFileName = path.basename(safeFileName);
      
      // 验证文件扩展名是否在白名单中
      if (!this.validateFileExtension(safeFileName)) {
        throw new CoolCommException('不允许的文件类型');
      }
    } else {
      // 验证从URL获取的扩展名是否在白名单中
      if (extend && !this.validateFileExtension(`file${extend}`)) {
        throw new CoolCommException('不允许的文件类型');
      }
      safeFileName = uuid() + extend;
    }

    const download = require('download');
    // 数据
    const data = url.includes('http')
      ? await download(url)
      : fs.readFileSync(url);

    // 创建文件夹
    const dirPath = path.join(basePath, dateDir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const targetPath = path.join(dirPath, safeFileName);
    // 验证最终路径
    this.validateTargetPath(targetPath, basePath);

    fs.writeFileSync(targetPath, data);
    return `${domain}/upload/${dateDir}/${safeFileName}`;
  }

  /**
   * 指定Key(路径)上传，本地文件上传到存储服务
   * @param filePath 文件路径
   * @param key 路径一致会覆盖源文件
   */
  async uploadWithKey(filePath: any, key: any) {
    const { domain } = this.pluginInfo.config;
    const basePath = pUploadPath();
    const dateDir = moment().format('YYYYMMDD');

    // 验证key安全性
    const safeKey = this.sanitizePath(key);
    
    // 验证文件扩展名是否在白名单中
    if (!this.validateFileExtension(safeKey)) {
      throw new CoolCommException('不允许的文件类型');
    }

    const data = fs.readFileSync(filePath);

    // 构建目标路径
    const targetPath = path.join(basePath, dateDir, safeKey);
    const dirPath = path.dirname(targetPath);

    // 验证最终路径
    this.validateTargetPath(targetPath, basePath);

    // 如果文件夹不存在则创建
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(targetPath, data);
    return `${domain}/upload/${dateDir}/${safeKey}`;
  }

  /**
   * 上传文件
   * @param ctx
   * @param key 文件路径
   */
  async upload(ctx: any) {
    const { domain } = this.pluginInfo.config;
    try {
      const { key } = ctx.fields;
      const basePath = pUploadPath();
      const dateDir = moment().format('YYYYMMDD');

      // 验证key安全性
      let safeKey: string | undefined;
      if (key) {
        safeKey = this.sanitizePath(key);
        
        // 验证文件扩展名是否在白名单中
        if (!this.validateFileExtension(safeKey)) {
          throw new CoolCommException('不允许的文件类型');
        }
      }

      if (_.isEmpty(ctx.files)) {
        throw new CoolCommException('上传文件为空');
      }

      const file = ctx.files[0];
      // 安全处理原始文件名
      const originalFileName = path.basename(file.filename);
      const extension = originalFileName.split('.').pop();
      
      // 构建待验证的最终文件名
      const finalName = safeKey || `${uuid()}.${extension}`;
      
      // 验证最终文件名的扩展名
      if (!this.validateFileExtension(finalName)) {
        throw new CoolCommException('不允许的文件类型');
      }
      
      const name = `${dateDir}/${finalName}`;
      const target = path.join(basePath, name);

      // 验证最终路径
      this.validateTargetPath(target, basePath);

      const dirPath = path.join(basePath, dateDir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      const data = fs.readFileSync(file.data);
      fs.writeFileSync(target, data);
      return domain + '/upload/' + name;
    } catch (err) {
      console.error(err);
      if (err instanceof CoolCommException) {
        throw err;
      }
      throw new CoolCommException('上传失败: ' + err.message);
    }
  }
}

// 导出插件实例， Plugin名称不可修改
export const Plugin = CoolPlugin;
