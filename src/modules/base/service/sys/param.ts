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

import { InjectClient, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Not, Repository } from 'typeorm';
import { BaseSysParamEntity } from '../../entity/sys/param';
import { CachingFactory, MidwayCache } from '@midwayjs/cache-manager';

/**
 * 参数配置
 */
@Provide()
export class BaseSysParamService extends BaseService {
  @InjectEntityModel(BaseSysParamEntity)
  baseSysParamEntity: Repository<BaseSysParamEntity>;

  @InjectClient(CachingFactory, 'default')
  midwayCache: MidwayCache;

  /**
   * 根据key获得对应的参数
   * @param key
   */
  async dataByKey(key) {
    let result: any = await this.midwayCache.get(`param:${key}`);
    if (!result) {
      result = await this.baseSysParamEntity.findOneBy({ keyName: key });
      this.midwayCache.set(`param:${key}`, result);
    }
    if (result) {
      if (result.dataType == 0) {
        try {
          return JSON.parse(result.data);
        } catch (error) {
          return result.data;
        }
      }
      if (result.dataType == 1) {
        return result.data;
      }
      if (result.dataType == 2) {
        return result.data.split(',');
      }
    }
    return;
  }

  /**
   * 信息
   * @param id
   * @param infoIgnoreProperty
   * @returns
   */
  async info(id: any, infoIgnoreProperty?: string[]): Promise<any> {
    const info = await super.info(id, infoIgnoreProperty);
    try {
      info.data = JSON.parse(info.data.replace(/{/g, '[').replace(/}/g, ']'));
    } catch (error) {
      info.data = info.data;
    }
    return info;
  }

  /**
   * 根据key获得对应的网页数据
   * @param key
   */
  async htmlByKey(key) {
    let html = '<html><title>@title</title><body>@content</body></html>';
    let result: any = await this.midwayCache.get(`param:${key}`);
    if (result) {
      html = html
        .replace('@content', result.data)
        .replace('@title', result.name);
    } else {
      html = html.replace('@content', 'key notfound');
    }
    return html;
  }

  /**
   * 添加或者修改
   * @param param
   */
  async addOrUpdate(param: any, type): Promise<void> {
    if (type == 2) {
      param.data = JSON.stringify(param.data.replace());
    }
    const find = {
      keyName: param.keyName,
    };
    if (param.id) {
      find['id'] = Not(param.id);
    }
    const check = await this.baseSysParamEntity.findOneBy(find);
    if (check) {
      throw new CoolCommException('存在相同的keyName');
    }
    await super.addOrUpdate(param, type);
  }

  /**
   * 重新初始化缓存
   */
  async modifyAfter() {
    const params = await this.baseSysParamEntity.find();
    for (const param of params) {
      await this.midwayCache.set(`param:${param.keyName}`, param);
    }
  }
}
