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

import { DemoCacheService } from '../../service/cache';
import { Inject, Post, Provide, Get, InjectClient, Logger } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { CachingFactory, MidwayCache } from '@midwayjs/cache-manager';
import { ILogger } from '@midwayjs/logger';

/**
 * 缓存
 */
@CoolController()
export class OpenDemoCacheController extends BaseController {
  @InjectClient(CachingFactory, 'default')
  midwayCache: MidwayCache;

  @Logger()
  logger: ILogger;

  @Inject()
  demoCacheService: DemoCacheService;

  /**
   * 安全的缓存设置方法，处理Redis只读等错误
   */
  private async safeCacheSet(key: string, value: any, ttl?: number) {
    try {
      if (ttl) {
        await this.midwayCache.set(key, value, ttl);
      } else {
        await this.midwayCache.set(key, value);
      }
      return true;
    } catch (error) {
      // 如果Redis是只读副本，记录错误但不抛出
      if (error.message && (error.message.includes('READONLY') || error.message.includes('read only'))) {
        this.logger.warn(`Redis is in read-only mode, skipping cache set for key: ${key}`, error.message);
        return false;
      } else {
        this.logger.error(`Failed to set cache for key: ${key}`, error);
        throw error;
      }
    }
  }

  /**
   * 设置缓存
   * @returns
   */
  @Post('/set', { summary: '设置缓存' })
  async set() {
    const success1 = await this.safeCacheSet('a', 1);
    // 缓存10秒
    const success2 = await this.safeCacheSet('a', 1, 10 * 1000);
    
    if (!success1 || !success2) {
      return this.fail('缓存操作失败，Redis可能处于只读模式');
    }
    
    return this.ok(await this.midwayCache.get('a'));
  }

  /**
   * 获得缓存
   * @returns
   */
  @Get('/get', { summary: '获得缓存' })
  async get() {
    return this.ok(await this.demoCacheService.get());
  }
}