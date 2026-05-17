/*
 Copyright © 2024-2026 Juzi Video. All rights reserved.
 版权所有 © 2024-2026 橘子视频。保留所有权利。
 作者：xiaoliwanshui
 邮箱：chocolaer@126.com


 ============================================================================
                                版权声明
 ============================================================================


 本软件（以下简称"本软件"）受中华人民共和国著作权法及国际著作权条约保护。


 【版权人】橘子视频 (Juzi Video)
 【权利范围】本软件的全部源代码、二进制文件、文档及相关材料


 ============================================================================
                                许可证协议
 ============================================================================


 本软件仅授权用户进行以下操作：


  ✓ 可免费试用：下载并运行本软件，仅限个人非商业用途
  ✓ 可学习研究：查看和学习本软件源代码，仅供个人研究


 ============================================================================
                                禁止事项
 ============================================================================


  ✗ 禁止商业使用：未经授权，不得对本软件进行销售、授权、出租或商业利用
  ✗ 禁止修改演绎：未经授权，不得对本软件进行修改、反向工程或创作衍生作品
  ✗ 禁止分发传播：未经授权，不得以任何形式向第三方分发或公开本软件
  ✗ 禁止删除版权：不得移除或篡改本软件中的任何版权声明或知识产权标识


 ============================================================================
                                免责声明
 ============================================================================


 本软件按"原样"提供，不提供任何明示或暗示的保证，包括但不限于：
 对适销性、特定用途适用性、非侵权性的保证。在任何情况下，
 版权持有人均不对因使用本软件而产生的任何索赔、损害或损失承担责任。


 ============================================================================
                                终止条款
 ============================================================================


 若您违反本协议的任何条款，本许可证将自动终止。
 终止后，您必须立即停止使用本软件，并销毁所有相关副本。


 ============================================================================
                                法律适用
 ============================================================================


 本协议受中华人民共和国法律管辖，并按其解释。


 ============================================================================
                                联系我们
 ============================================================================


 如需商业授权或其他合作事宜，请联系版权方。


 ---


 本软件受著作权法和国际条约保护。
 未经授权的复制、修改、分发或商业使用将被追究法律责任。
*/

import { BaseUpload, MODETYPE } from './interface';
import { BasePluginHook } from '../base';
import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';
import { v1 as uuid } from 'uuid';
import { CoolCommException } from '@cool-midway/core';
import * as _ from 'lodash';
import { pUploadPath } from '../../../../comm/path';

/**
 * 文件上传
 */
export class CoolPlugin extends BasePluginHook implements BaseUpload {
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
    const extend = path.extname(fileName ? fileName : url);
    const download = require('download');
    // 数据
    const data = url.includes('http')
      ? await download(url)
      : fs.readFileSync(url);
    // 创建文件夹
    const dirPath = path.join(pUploadPath(), `${moment().format('YYYYMMDD')}`);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    const uuidStr = uuid();
    const name = `${moment().format('YYYYMMDD')}/${
      fileName ? fileName : uuidStr + extend
    }`;
    fs.writeFileSync(
      `${dirPath}/${fileName ? fileName : uuid() + extend}`,
      data
    );
    return `${domain}/upload/${name}`;
  }

  /**
   * 指定Key(路径)上传，本地文件上传到存储服务
   * @param filePath 文件路径
   * @param key 路径一致会覆盖源文件
   */
  async uploadWithKey(filePath: any, key: any) {
    const { domain } = this.pluginInfo.config;
    const data = fs.readFileSync(filePath);
    // 如果文件夹不存在则创建
    const dirPath = path.join(
      pUploadPath(),
      moment().format('YYYYMMDD'),
      path.dirname(key)
    );
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(
      path.join(pUploadPath(), moment().format('YYYYMMDD'), key),
      data
    );
    return `${domain}/upload/${moment().format('YYYYMMDD')}/${key}`;
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
      if (
        key &&
        (key.includes('..') ||
          key.includes('./') ||
          key.includes('\\') ||
          key.includes('//'))
      ) {
        throw new CoolCommException('非法的key值');
      }
      if (_.isEmpty(ctx.files)) {
        throw new CoolCommException('上传文件为空');
      }
      const basePath = pUploadPath();

      const file = ctx.files[0];
      const extension = file.filename.split('.').pop();
      const name =
        moment().format('YYYYMMDD') + '/' + (key || `${uuid()}.${extension}`);
      const target = path.join(basePath, name);
      const dirPath = path.join(basePath, moment().format('YYYYMMDD'));
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }
      const data = fs.readFileSync(file.data);
      fs.writeFileSync(target, data);
      return domain + '/upload/' + name;
    } catch (err) {
      console.error(err);
      throw new CoolCommException('上传失败' + err.message);
    }
  }
}

// 导出插件实例， Plugin名称不可修改
export const Plugin = CoolPlugin;
