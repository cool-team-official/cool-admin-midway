import { BaseEntity } from '@cool-midway/core';
import { Column, Index, Entity } from 'typeorm';

/**
 * 任务日志
 */
@Entity('task_log')
export class TaskLogEntity extends BaseEntity {
  @Index()
  @Column({ comment: '任务ID', nullable: true })
  taskId: number;

  @Column({ comment: '状态 0-失败 1-成功', default: 0 })
  status: number;

  @Column({ comment: '详情描述', nullable: true, type: 'text' })
  detail: string;
}
