import { App, Config, Inject, Middleware } from '@midwayjs/core';
import * as _ from 'lodash';
import { CoolCommException, CoolUrlTagData, TagTypes } from '@cool-midway/core';
import * as jwt from 'jsonwebtoken';
import { NextFunction, Context } from '@midwayjs/koa';
import {
  IMiddleware,
  IMidwayApplication,
  Init,
  InjectClient,
} from '@midwayjs/core';
import { CachingFactory, MidwayCache } from '@midwayjs/cache-manager';
import { Utils } from '../../../comm/utils';

/**
 * 权限校验中间件
 * 
 * 【设计模式注释】
 * 1. 责任链模式 (Chain of Responsibility Pattern): 作为中间件链中的一环，处理请求权限验证
 * 2. 依赖注入模式 (Dependency Injection Pattern): 通过装饰器注入所需依赖
 * 3. 策略模式 (Strategy Pattern): 可根据不同URL应用不同的权限验证策略
 * 
 * 【算法实现注释】
 * 1. JWT验证算法: 解析和验证JWT令牌的有效性
 * 2. 权限匹配算法: 检查用户权限是否包含访问当前URL的权限
 * 3. URL匹配算法: 使用utils.matchUrl实现复杂的URL模式匹配
 * 4. 缓存查找算法: 从缓存中获取用户权限和令牌信息
 * 
 * 【安全算法注释】
 * 1. 令牌有效性验证算法
 * 2. 密码版本验证算法
 * 3. SSO单点登录验证算法
 * 
 * 【代码规范注释】
 * 1. 命名规范: 遵循camelCase命名约定
 * 2. 错误处理: 统一使用CoolCommException处理异常
 * 3. 模块职责: 专注于权限验证逻辑，不涉及业务处理
 */
@Middleware()
export class BaseAuthorityMiddleware
  implements IMiddleware<Context, NextFunction>
{
  // 【配置注入】注入全局路由前缀配置
  @Config('koa.globalPrefix')
  prefix;

  // 【配置注入】注入JWT配置信息
  @Config('module.base')
  jwtConfig;

  // 【依赖注入-缓存客户端】注入缓存工厂客户端，用于令牌和权限缓存管理
  @InjectClient(CachingFactory, 'default')
  midwayCache: MidwayCache;

  // 【依赖注入-URL标签数据】注入URL标签数据服务，用于获取忽略令牌验证的URL列表
  @Inject()
  coolUrlTagData: CoolUrlTagData;

  // 【依赖注入-应用实例】注入Midway应用实例
  @App()
  app: IMidwayApplication;

  // 【依赖注入-工具类】注入工具类，提供各种辅助功能
  @Inject()
  utils: Utils;

  // 【算法变量】存储忽略令牌验证的URL列表
  ignoreUrls: string[] = [];

  // 【初始化方法】在中间件初始化时加载忽略令牌验证的URL列表
  @Init()
  async init() {
    // 【算法实现-配置加载算法】从URL标签数据中获取忽略令牌验证的管理员端URL列表
    this.ignoreUrls = this.coolUrlTagData.byKey(TagTypes.IGNORE_TOKEN, 'admin');
  }

  /**
   * 【设计模式-中间件模式】实现中间件处理函数
   * 【算法实现-请求处理算法】对进入的请求进行权限验证
   */
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 【算法变量】存储HTTP响应状态码
      let statusCode = 200;
      
      // 【算法实现-URL标准化算法】移除路由前缀并去除查询参数，获取纯净的请求路径
      let { url } = ctx;
      url = url.replace(this.prefix, '').split('?')[0];
      
      // 【算法实现-令牌提取算法】从请求头中提取Authorization令牌
      const token = ctx.get('Authorization');
      
      // 【算法常量】管理员端URL前缀
      const adminUrl = '/admin/';
      
      // 【算法实现-路由判断算法】仅对管理员端请求进行权限校验
      if (_.startsWith(url, adminUrl)) {
        // 【算法实现-JWT验证算法】验证JWT令牌的有效性
        try {
          // 【安全算法-令牌验证】使用预设密钥验证JWT令牌
          ctx.admin = jwt.verify(token, this.jwtConfig.jwt.secret);
          
          // 【安全算法-刷新令牌检查】检查是否为刷新令牌，若是则拒绝访问
          if (ctx.admin.isRefresh) {
            ctx.status = 401;
            throw new CoolCommException('登录失效~', ctx.status);
          }
        } catch (error) {}
        
        // 【算法实现-URL匹配算法】检查当前URL是否在忽略令牌验证的列表中
        const isIgnored = this.ignoreUrls.some(pattern =>
          // 【算法实现-高级URL匹配算法】使用工具类的matchUrl方法实现灵活的URL模式匹配
          this.utils.matchUrl(pattern, url)
        );
        
        // 【算法实现-访问控制算法】如果URL在忽略列表中，则跳过权限校验
        if (isIgnored) {
          await next();
          return;
        }
        // 【算法实现-权限验证算法】如果JWT验证成功，继续进行深层权限校验
        if (ctx.admin) {
          // 【算法实现-缓存查询算法】从缓存中获取用户的注册令牌
          const rToken = await this.midwayCache.get(
            `admin:token:${ctx.admin.userId}`
          );
          
          // 【算法实现-密码版本验证算法】检查缓存中的密码版本与JWT中的版本是否一致
          const passwordV = await this.midwayCache.get(
            `admin:passwordVersion:${ctx.admin.userId}`
          );
          
          // 【安全算法-密码版本控制】如果密码版本不匹配，表示密码已更改，原令牌失效
          if (passwordV != ctx.admin.passwordVersion) {
            throw new CoolCommException('登录失效~', 401);
          }
          // 【算法实现-超级管理员特权算法】超级管理员拥有所有权限，但需验证令牌有效性
          if (ctx.admin.username == 'admin' && !ctx.admin.isRefresh) {
            // 【安全算法-SSO单点登录验证】在SSO模式下验证令牌与缓存令牌的一致性
            if (rToken !== token && this.jwtConfig.jwt.sso) {
              throw new CoolCommException('登录失效~', 401);
            } else {
              await next();
              return;
            }
          }
          // 【算法实现-公共接口豁免算法】某些公共接口无需额外权限验证，只要登录即可访问
          if (
            // 【算法实现-正则匹配算法】匹配以 /admin/.../comm/ 开头的公共接口
            new RegExp(`^${adminUrl}?.*/comm/`).test(url) ||
            // 【算法实现-字典接口豁免】字典数据接口无需特殊权限
            url == '/admin/dict/info/data'
          ) {
            await next();
            return;
          }
          // 【安全算法-刷新令牌拒绝】再次检查是否为刷新令牌，若是则拒绝访问
          if (ctx.admin.isRefresh) {
            throw new CoolCommException('登录失效~', 401);
          }
          
          // 【算法实现-令牌存在性验证】检查用户是否有有效的注册令牌
          if (!rToken) {
            throw new CoolCommException('登录失效或无权限访问~', 401);
          }
          
          // 【安全算法-SSO令牌一致性验证】在SSO模式下验证令牌与缓存令牌是否一致
          if (rToken !== token && this.jwtConfig.jwt.sso) {
            statusCode = 401;
          } else {
            // 【算法实现-权限匹配算法】获取用户权限列表并验证是否有访问当前URL的权限
            let perms: string[] = await this.midwayCache.get(
              `admin:perms:${ctx.admin.userId}`
            );
            
            // 【算法实现-权限格式转换算法】将权限标识中的冒号替换为斜杠，以便与URL进行比较
            if (!_.isEmpty(perms)) {
              perms = perms.map(e => {
                return e.replace(/:/g, '/');
              });
              
              // 【算法实现-权限校验算法】检查用户权限列表是否包含当前访问的URL
              if (!perms.includes(url.split('?')[0].replace('/admin/', ''))) {
                statusCode = 403; // 无权限访问
              }
            } else {
              statusCode = 403; // 无权限访问
            }
          }
        } else {
          // 【算法实现-未认证处理】如果JWT验证失败，返回401未授权
          statusCode = 401;
        }
        
        // 【算法实现-错误响应算法】如果状态码大于200，抛出相应异常
        if (statusCode > 200) {
          throw new CoolCommException('登录失效或无权限访问~', statusCode);
        }
      }
      await next();
    };
  }
}
