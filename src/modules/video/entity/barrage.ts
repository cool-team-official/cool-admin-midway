import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

@Entity('video_barrage') // 替换 your_table_name 为您的 MySQL 表名
export class BarrageEntity extends BaseEntity {
  @Column({ type: 'int', comment: '时间', nullable: true })
  time: number;

  @Column({ type: 'bigint', comment: '视频ID', unsigned: true })
  video_id: number;

  @Column({
    type: 'bigint',
    comment: '剧集',
    unsigned: true,
    default: 0,
    nullable: true,
  })
  sort: number;

  @Column({ type: 'text', comment: '弹幕内容' })
  text: string;

  @Column({ comment: '弹幕字体大小', nullable: true })
  fontSize: number;

  @Column({ comment: '弹幕类型', nullable: true })
  type: number;

  @Column({ type: 'varchar', length: 20, nullable: true, comment: '弹幕颜色' })
  color: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态' })
  status: number;
}
