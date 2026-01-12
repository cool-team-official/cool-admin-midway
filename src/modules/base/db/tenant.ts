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
 * 
 * 【算法实现注释】
 * 租户临时绕过算法: 临时清除租户ID执行函数，然后恢复原始租户ID
 * 用于在需要绕过多租户限制的场景下执行操作
 * 
 * @param ctx 上下文对象
 * @param func 待执行的函数
 */
export const noTenant = async (ctx, func) => {
  let result;
  // 【算法实现-租户ID保存】保存当前租户ID
  const tenantId = ctx?.admin?.tenantId;
  if (tenantId) {
    // 【算法实现-租户绕过】临时清除租户ID
    ctx.admin.tenantId = null;
    // 【算法实现-函数执行】执行目标函数
    result = await func();
    // 【算法实现-租户恢复】恢复原始租户ID
    ctx.admin.tenantId = tenantId;
  } else {
    // 【算法实现-直接执行】如果没有租户ID，直接执行函数
    result = await func();
  }
  return result;
};

/**
 * 多租户订阅器
 * 
 * 【设计模式注释】
 * 1. 观察者模式 (Observer Pattern): 作为TypeORM事件订阅器，监听数据库操作事件
 * 2. 策略模式 (Strategy Pattern): 根据租户配置应用不同的过滤策略
 * 3. 单例模式 (Singleton Pattern): 事件订阅器通常为单例
 * 
 * 【算法实现注释】
 * 1. 租户过滤算法: 在数据库查询中自动添加租户ID条件
 * 2. 租户注入算法: 在插入操作中自动添加租户ID
 * 3. 租户验证算法: 验证操作是否符合租户权限
 * 
 * 【代码规范注释】
 * 1. 命名规范: 遵循PascalCase命名约定
 * 2. 职责分离: 专注于多租户逻辑处理
 * 3. 配置驱动: 通过配置控制多租户行为
 */
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
   * 
   * 【算法实现注释】
   * 租户需求判断算法: 根据当前请求URL和配置判断是否需要应用租户过滤
   * 
   * @returns 是否需要应用租户过滤的布尔值
   */
  checkHandler() {
    // 【算法实现-上下文获取】获取当前请求上下文
    const ctx = this.getCtx();
    if (!ctx) return false;
    
    // 【算法实现-URL提取】从上下文中提取请求URL
    const url = ctx?.url;
    if (!url) return false;
    
    // 【算法实现-租户开关检查】检查租户功能是否启用
    if (this.tenant?.enable) {
      // 【算法实现-URL匹配算法】使用URL匹配算法检查当前URL是否在租户过滤列表中
      const isNeedTenant = this.tenant.urls.some(pattern =>
        // 【算法实现-高级匹配算法】使用工具类的matchUrl方法进行复杂URL模式匹配
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
   * 
   * 【算法实现注释】
   * 租户ID提取算法: 根据当前用户身份和请求上下文获取对应的租户ID
   * 包含多层验证和过滤逻辑
   * 
   * @returns 租户ID或undefined
   */
  getTenantId(): number | undefined {
    let ctx, url, tenantId;
    
    // 【算法实现-上下文获取】获取当前请求上下文
    ctx = this.getCtx();
    // 【算法实现-前置条件检查】检查上下文是否存在以及是否需要租户处理
    if (!ctx || !this.checkHandler()) return undefined;
    
    // 【算法实现-URL提取】获取当前请求URL
    url = ctx?.url;
    
    // 【算法实现-忽略用户检查】检查当前用户是否在忽略租户过滤的白名单中
    if (this.ignoreUsername.includes(ctx?.admin?.username)) {
      return undefined;
    }
    
    // 【算法实现-忽略URL检查】检查当前URL是否在系统忽略列表中
    if (
      // 【算法实现-批量匹配算法】检查URL是否匹配任何忽略模式
      this.getAllIgnoreUrls().some(pattern => this.utils.matchUrl(pattern, url))
    ) {
      return undefined;
    }
    
    // 【算法实现-路径前缀判断算法】根据URL前缀确定使用哪种租户ID
    if (_.startsWith(url, '/admin/')) {
      // 管理端使用admin.tenantId
      tenantId = ctx?.admin?.tenantId;
    } else if (_.startsWith(url, '/app/')) {
      // 应用端使用user.tenantId
      tenantId = ctx?.user?.tenantId;
    }
    
    // 【算法实现-有效性检查】确认租户ID和URL都存在
    if (tenantId && url) {
      return tenantId;
    }
    return undefined;
  }

  /**
   * 查询时添加租户ID条件
   * 
   * 【算法实现注释】
   * 租户查询过滤算法: 在SELECT查询中自动添加租户ID过滤条件
   * 确保用户只能访问自己租户的数据
   * 
   * @param queryBuilder TypeORM查询构建器
   */
  afterSelectQueryBuilder(queryBuilder: SelectQueryBuilder<any>) {
    // 【算法实现-功能开关检查】检查租户功能是否启用
    if (!this.tenant?.enable) return;
    
    // 【算法实现-租户ID获取】获取当前请求的租户ID
    const tenantId = this.getTenantId();
    
    // 【算法实现-条件添加算法】如果存在租户ID，则添加过滤条件
    if (tenantId) {
      // 【算法实现-动态条件构建算法】根据查询别名动态构建租户ID条件
      queryBuilder.andWhere(
        `${
          // 【算法实现-别名处理算法】如果有查询别名则加上别名前缀，否则直接使用字段名
          queryBuilder.alias ? queryBuilder.alias + '.' : ''
        }tenantId = '${tenantId}'`
      );
    }
  }

  /**
   * 插入时添加租户ID
   * 
   * 【算法实现注释】
   * 租户ID注入算法: 在INSERT操作中自动为数据记录添加租户ID
   * 确保新插入的数据归属于正确的租户
   * 
   * @param queryBuilder TypeORM插入查询构建器
   */
  afterInsertQueryBuilder(queryBuilder: InsertQueryBuilder<any>) {
    // 【算法实现-功能开关检查】检查租户功能是否启用
    if (!this.tenant?.enable) return;
    
    // 【算法实现-租户ID获取】获取当前请求的租户ID
    const tenantId = this.getTenantId();
    
    // 【算法实现-租户ID注入算法】如果存在租户ID，则将其注入到插入值中
    if (tenantId) {
      // 【算法实现-值提取算法】获取待插入的数值
      const values = queryBuilder.expressionMap.valuesSet;
      
      // 【算法实现-数据类型判断算法】根据插入数据的类型采用不同的注入策略
      if (Array.isArray(values)) {
        // 【算法实现-批量注入算法】批量插入时为每条记录添加租户ID
        queryBuilder.values(values.map(item => ({ ...item, tenantId })));
      } else if (typeof values === 'object') {
        // 【算法实现-单条注入算法】单条插入时直接添加租户ID
        queryBuilder.values({ ...values, tenantId });
      }
    }
  }

  /**
   * 更新时添加租户ID和条件
   * 
   * 【算法实现注释】
   * 租户更新限制算法: 在UPDATE操作中添加租户ID条件
   * 确保只能更新属于当前租户的数据
   * 
   * @param queryBuilder TypeORM更新查询构建器
   */
  afterUpdateQueryBuilder(queryBuilder: UpdateQueryBuilder<any>) {
    // 【算法实现-功能开关检查】检查租户功能是否启用
    if (!this.tenant?.enable) return;
    
    // 【算法实现-租户ID获取】获取当前请求的租户ID
    const tenantId = this.getTenantId();
    
    // 【算法实现-条件添加算法】如果存在租户ID，则添加更新条件
    if (tenantId) {
      // 【算法实现-安全条件算法】添加租户ID条件防止跨租户更新
      queryBuilder.andWhere(`tenantId = '${tenantId}'`);
    }
  }

  /**
   * 删除时添加租户ID和条件
   * 
   * 【算法实现注释】
   * 租户删除限制算法: 在DELETE操作中添加租户ID条件
   * 确保只能删除属于当前租户的数据
   * 
   * @param queryBuilder TypeORM删除查询构建器
   */
  afterDeleteQueryBuilder(queryBuilder: DeleteQueryBuilder<any>) {
    // 【算法实现-功能开关检查】检查租户功能是否启用
    if (!this.tenant?.enable) return;
    
    // 【算法实现-租户ID获取】获取当前请求的租户ID
    const tenantId = this.getTenantId();
    
    // 【算法实现-条件添加算法】如果存在租户ID，则添加删除条件
    if (tenantId) {
      // 【算法实现-安全条件算法】添加租户ID条件防止跨租户删除
      queryBuilder.andWhere(`tenantId = '${tenantId}'`);
    }
  }
}
