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

import { EventSubscriberModel } from '@midwayjs/typeorm';
import {
  DeleteQueryBuilder,
  EntitySubscriberInterface,
  InsertQueryBuilder,
  SelectQueryBuilder,
  UpdateQueryBuilder,
} from 'typeorm';
import * as _ from 'lodash';
import {
  App,
  ASYNC_CONTEXT_KEY,
  ASYNC_CONTEXT_MANAGER_KEY,
  AsyncContextManager,
  Config,
  IMidwayApplication,
  IMidwayContext,
  Inject,
} from '@midwayjs/core';
import { Utils } from '../../../comm/utils';
import { CoolUrlTagData, TagTypes } from '@cool-midway/core';

/**
 * 不操作租户
 * @param ctx
 * @param func
 */
export const noTenant = async (ctx, func) => {
  let result;
  const tenantId = ctx?.admin?.tenantId;
  if (tenantId) {
    ctx.admin.tenantId = null;
    result = await func();
    ctx.admin.tenantId = tenantId;
  } else {
    result = await func();
  }
  return result;
};

@EventSubscriberModel()
export class TenantSubscriber implements EntitySubscriberInterface<any> {
  @App()
  app: IMidwayApplication;

  @Inject()
  ctx: IMidwayContext;

  @Inject()
  coolUrlTagData: CoolUrlTagData;

  @Config('cool.tenant')
  tenant: {
    // 是否开启多租户
    enable: boolean;
    // 需要过滤多租户的url
    urls: string[];
  };

  // 系统接口不过滤
  ignoreUrls = [
    '/admin/base/open/login',
    '/admin/base/comm/person',
    '/admin/base/comm/permmenu',
    '/admin/dict/info/data',
  ];

  // 不进行租户过滤的用户
  ignoreUsername = [];

  @Inject()
  utils: Utils;

  /**
   * 获取所有忽略的url
   */
  getAllIgnoreUrls() {
    const adminIgnoreUrls = this.coolUrlTagData.byKey(
      TagTypes.IGNORE_TOKEN,
      'admin'
    );
    const appIgnoreUrls = this.coolUrlTagData.byKey(
      TagTypes.IGNORE_TOKEN,
      'app'
    );
    this.ignoreUrls = [
      ...this.ignoreUrls,
      ...adminIgnoreUrls,
      ...appIgnoreUrls,
    ];
    // 去重
    this.ignoreUrls = _.uniq(this.ignoreUrls);
    return this.ignoreUrls;
  }

  /**
   * 检查是否需要租户
   */
  checkHandler() {
    const ctx = this.getCtx();
    if (!ctx) return false;
    const url = ctx?.url;
    if (!url) return false;
    if (this.tenant?.enable) {
      const isNeedTenant = this.tenant.urls.some(pattern =>
        this.utils.matchUrl(pattern, url)
      );
      return isNeedTenant;
    }
    return false;
  }

  /**
   * 获取ctx
   */
  getCtx(): any {
    try {
      const contextManager: AsyncContextManager = this.app
        .getApplicationContext()
        .get(ASYNC_CONTEXT_MANAGER_KEY);
      return contextManager.active().getValue(ASYNC_CONTEXT_KEY);
    } catch (error) {
      return null;
    }
  }

  /**
   * 从登录的用户中获取租户ID
   * @returns string | undefined
   */
  getTenantId(): number | undefined {
    let ctx, url, tenantId;
    ctx = this.getCtx();
    if (!ctx || !this.checkHandler()) return undefined;
    url = ctx?.url;
    // 忽略用户
    if (this.ignoreUsername.includes(ctx?.admin?.username)) {
      return undefined;
    }
    // 忽略系统接口
    if (
      this.getAllIgnoreUrls().some(pattern => this.utils.matchUrl(pattern, url))
    ) {
      return undefined;
    }
    if (_.startsWith(url, '/admin/')) {
      tenantId = ctx?.admin?.tenantId;
    } else if (_.startsWith(url, '/app/')) {
      tenantId = ctx?.user?.tenantId;
    }
    if (tenantId && url) {
      return tenantId;
    }
    return undefined;
  }

  /**
   * 查询时添加租户ID条件
   * @param queryBuilder
   */
  afterSelectQueryBuilder(queryBuilder: SelectQueryBuilder<any>) {
    if (!this.tenant?.enable) return;
    const tenantId = this.getTenantId();
    if (tenantId) {
      queryBuilder.andWhere(
        `${
          queryBuilder.alias ? queryBuilder.alias + '.' : ''
        }tenantId = '${tenantId}'`
      );
    }
  }

  /**
   * 插入时添加租户ID
   * @param queryBuilder
   */
  afterInsertQueryBuilder(queryBuilder: InsertQueryBuilder<any>) {
    if (!this.tenant?.enable) return;
    const tenantId = this.getTenantId();
    if (tenantId) {
      const values = queryBuilder.expressionMap.valuesSet;
      if (Array.isArray(values)) {
        queryBuilder.values(values.map(item => ({ ...item, tenantId })));
      } else if (typeof values === 'object') {
        queryBuilder.values({ ...values, tenantId });
      }
    }
  }

  /**
   * 更新时添加租户ID和条件
   * @param queryBuilder
   */
  afterUpdateQueryBuilder(queryBuilder: UpdateQueryBuilder<any>) {
    if (!this.tenant?.enable) return;
    const tenantId = this.getTenantId();
    if (tenantId) {
      queryBuilder.andWhere(`tenantId = '${tenantId}'`);
    }
  }

  /**
   * 删除时添加租户ID和条件
   * @param queryBuilder
   */
  afterDeleteQueryBuilder(queryBuilder: DeleteQueryBuilder<any>) {
    if (!this.tenant?.enable) return;
    const tenantId = this.getTenantId();
    if (tenantId) {
      queryBuilder.andWhere(`tenantId = '${tenantId}'`);
    }
  }
}
