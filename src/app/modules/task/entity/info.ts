import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from 'midwayjs-cool-core';
import { Column } from 'typeorm';

/**
 * 任务信息
 */
@EntityModel('task_info')
export class TaskInfoEntity extends BaseEntity {
  @Column({ comment: '任务ID', nullable: true })
  jobId: string;

  @Column({ comment: '任务配置', nullable: true, length: 1000 })
  repeatConf: string;

  @Column({ comment: '名称' })
  name: string;

  @Column({ comment: 'cron', nullable: true })
  cron: string;

  @Column({ comment: '最大执行次数 不传为无限次', nullable: true })
  limit: number;

  @Column({
    comment: '每间隔多少毫秒执行一次 如果cron设置了 这项设置就无效',
    nullable: true,
  })
  every: number;

  @Column({ comment: '备注', nullable: true })
  remark: string;

  @Column({ comment: '状态 0:停止 1：运行', default: 1, type: 'tinyint' })
  status: number;

  @Column({ comment: '开始时间', nullable: true })
  startDate: Date;

  @Column({ comment: '结束时间', nullable: true })
  endDate: Date;

  @Column({ comment: '数据', nullable: true })
  data: string;

  @Column({ comment: '执行的service实例ID', nullable: true })
  service: string;

  @Column({ comment: '状态 0:系统 1：用户', default: 0, type: 'tinyint' })
  type: number;

  @Column({ comment: '下一次执行时间', nullable: true })
  nextRunTime: Date;

  @Column({ comment: '状态 0:cron 1：时间间隔', default: 0, type: 'tinyint' })
  taskType: number;
}
