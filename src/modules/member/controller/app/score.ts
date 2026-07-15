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

import { Body, Inject, Post, Provide } from '@midwayjs/core';
import {
  BaseController,
  CoolController,
  CoolUrlTag,
  TagTypes,
  CoolTag,
} from '@cool-midway/core';
import { BusinessType, ScoreService } from '../../service/score';
import { Context } from '@midwayjs/koa';
import { ScoreEntity } from '../../entity/score';

/**
 * APP积分控制器
 */
@Provide()
@CoolUrlTag({
  key: TagTypes.IGNORE_TOKEN,
  value: ['total', 'records'],
})
@CoolController({
  api: ['info', 'list', 'page'],
  entity: ScoreEntity,
  insertParam: ctx => {
    return {
      createUserId: ctx.user.id,
    };
  },
  pageQueryOp: {
    where: async ctx => {
      return [['createUserId =:createUserId', { createUserId: ctx.user.id }]];
    },
  },
})
export class ScoreAppController extends BaseController {
  @Inject()
  scoreService: ScoreService;

  @Inject()
  ctx: Context;

  /**
   * 获取当前用户积分总和
   */
  @Post('/total', { summary: '获取当前用户积分总和' })
  async getTotal() {
    const total = await this.scoreService.getUserTotalScore(this.ctx.user.id);
    return this.ok(total);
  }

  /**
   * 获取当前用户积分记录
   */
  @Post('/records', { summary: '获取当前用户积分记录' })
  async getRecords() {
    // 从上下文中获取当前用户ID
    const createUserId = this.ctx.state.user?.id;
    if (!createUserId) {
      return this.fail('用户未登录');
    }
    // 修复TypeScript类型错误
    const body = this.ctx.request.body as Record<string, any>;
    let page = parseInt(body?.page);
    let size = parseInt(body?.size);

    // 确保page和size是有效数字且在合理范围内
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(size) || size < 1) size = 20;
    if (size > 100) size = 100; // 限制每页最大记录数

    const records = await this.scoreService.getUserScoreRecords(
      createUserId,
      page,
      size
    );
    return this.ok(records);
  }

  @Post('/addScore', { summary: '添加积分' })
  async addScore(
    @Body('reason') reason: string,
    @Body('businessId') businessId: number,
    @Body('businessType') businessType?: BusinessType
  ) {
    try {
      const createUserId = this.ctx.user.id;
      return this.ok(
        await this.scoreService.addScore(
          createUserId,
          businessId,
          businessType,
          reason
        )
      );
    } catch (e) {
      return this.fail(e);
    }
  }
}
