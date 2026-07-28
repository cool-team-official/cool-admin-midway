import { BaseUpload, MODETYPE } from './interface';
import { BasePluginHook } from '../base';
import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';
import { v1 as uuid } from 'uuid';
import { CoolCommException } from '@cool-midway/core';
import * as _ from 'lodash';
import { pUploadPath } from '@/comm/path';

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
    } else {
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
      }

      if (_.isEmpty(ctx.files)) {
        throw new CoolCommException('上传文件为空');
      }

      const file = ctx.files[0];
      // 安全处理原始文件名
      const originalFileName = path.basename(file.filename);
      const extension = originalFileName.split('.').pop();

      const finalName = safeKey || `${uuid()}.${extension}`;
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
