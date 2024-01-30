import { BaseUpload, MODETYPE } from './interface';
import { BasePluginHook } from '../base';
import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';
import { v1 as uuid } from 'uuid';
import { CoolCommException } from '@cool-midway/core';
import * as _ from 'lodash';

/**
 * 文件上传
 */
export class PluginUpload extends BasePluginHook implements BaseUpload {
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
    // 从url获取扩展名
    const extend = path.extname(url);
    const download = require('download');
    // 数据
    const data = url.includes('http')
      ? await download(url)
      : fs.readFileSync(url);
    // 创建文件夹
    const dirPath = path.join(
      this.app.getBaseDir(),
      '..',
      `public/uploads/${moment().format('YYYYMMDD')}`
    );
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(
      `${dirPath}/${fileName ? fileName : uuid() + extend}`,
      data
    );
    return `${domain}/public/${name}`;
  }

  /**
   * 指定Key(路径)上传，本地文件上传到存储服务
   * @param filePath 文件路径
   * @param key 路径一致会覆盖源文件
   */
  async uploadWithKey(filePath: any, key: any) {
    const { domain } = this.pluginInfo.config;
    const data = fs.readFileSync(filePath);
    fs.writeFileSync(path.join(this.app.getBaseDir(), '..', key), data);
    return domain + key;
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
      if (_.isEmpty(ctx.files)) {
        throw new CoolCommException('上传文件为空');
      }
      const file = ctx.files[0];
      const extension = file.filename.split('.').pop();
      const name =
        moment().format('YYYYMMDD') + '/' + (key || `${uuid()}.${extension}`);
      const target = path.join(
        this.app.getBaseDir(),
        '..',
        `public/uploads/${name}`
      );
      const dirPath = path.join(
        this.app.getBaseDir(),
        '..',
        `public/uploads/${moment().format('YYYYMMDD')}`
      );
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }
      const data = fs.readFileSync(file.data);
      fs.writeFileSync(target, data);
      return domain + '/public/uploads/' + name;
    } catch (err) {
      throw new CoolCommException('上传失败');
    }
  }
}

// 导出插件实例， Plugin名称不可修改
export const Plugin = PluginUpload;
