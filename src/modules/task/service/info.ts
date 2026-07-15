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

import {
  App,
  IMidwayApplication,
  Init,
  Inject,
  Provide,
  Scope,
  ScopeEnum,
} from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { TaskInfoEntity } from '../entity/info';
import { CoolQueueHandle } from '@cool-midway/task';
import { TaskBullService } from './bull';
import { TaskLocalService } from './local';
import { TaskLogEntity } from '../entity/log';

/**
 * 任务
 */
@Provide()
@Scope(ScopeEnum.Request, { allowDowngrade: true })
export class TaskInfoService extends BaseService {
  @InjectEntityModel(TaskInfoEntity)
  taskInfoEntity: Repository<TaskInfoEntity>;

  @InjectEntityModel(TaskLogEntity)
  taskLogEntity: Repository<TaskLogEntity>;

  type: 'local' | 'bull' = 'local';

  @App()
  app: IMidwayApplication;

  @Inject()
  taskBullService: TaskBullService;

  @Inject()
  taskLocalService: TaskLocalService;

  @Init()
  async init() {
    await super.init();
    await this.initType();
    this.setEntity(this.taskInfoEntity);
  }

  /**
   * 初始化任务类型
   */
  async initType() {
    try {
      const check = await this.app
        .getApplicationContext()
        .getAsync(CoolQueueHandle);
      if (check) {
        this.type = 'bull';
      } else {
        this.type = 'local';
      }
    } catch (e) {
      this.type = 'local';
    }
    return this.type;
  }

  /**
   * 停止任务
   * @param id
   */
  async stop(id) {
    this.type === 'bull'
      ? await this.taskBullService.stop(id)
      : await this.taskLocalService.stop(id);
  }

  /**
   * 开始任务
   * @param id
   * @param type
   */
  async start(id, type?) {
    this.type === 'bull'
      ? await this.taskBullService.start(id, type)
      : await this.taskLocalService.start(id, type);
  }

  /**
   * 手动执行一次
   * @param id
   */
  async once(id) {
    this.type === 'bull'
      ? await this.taskBullService.once(id)
      : await this.taskLocalService.once(id);
  }

  /**
   * 检查任务是否存在
   * @param jobId
   */
  async exist(jobId) {
    return this.type === 'bull'
      ? this.taskBullService.exist(jobId)
      : this.taskLocalService.exist(jobId);
  }

  /**
   * 新增或修改
   * @param params
   */
  async addOrUpdate(params) {
    return this.type === 'bull'
      ? this.taskBullService.addOrUpdate(params)
      : this.taskLocalService.addOrUpdate(params);
  }

  /**
   * 删除
   * @param ids
   */
  async delete(ids) {
    return this.type === 'bull'
      ? this.taskBullService.delete(ids)
      : this.taskLocalService.delete(ids);
  }

  /**
   * 任务日志
   * @param query
   */
  async log(query) {
    const { id, status } = query;
    const find = await this.taskLogEntity
      .createQueryBuilder('a')
      .select(['a.*', 'b.name as taskName'])
      .leftJoin(TaskInfoEntity, 'b', 'a.taskId = b.id')
      .where('a.taskId = :id', { id });
    if (status || status == 0) {
      find.andWhere('a.status = :status', { status });
    }
    return await this.entityRenderPage(find, query);
  }

  /**
   * 初始化任务
   */
  async initTask() {
    return this.type === 'bull'
      ? this.taskBullService.initTask()
      : this.taskLocalService.initTask();
  }

  /**
   * 详情
   * @param id
   * @returns
   */
  async info(id: any): Promise<any> {
    return this.type === 'bull'
      ? this.taskBullService.info(id)
      : this.taskLocalService.info(id);
  }

  /**
   * 修改采集间隔时间
   */
}
