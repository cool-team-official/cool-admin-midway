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

import { Column, Entity, Index, Unique } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

const _ = require('lodash');

/**
 * 视频信息实体
 */
@Entity('video')
@Unique(['title'])
@Index(['year', 'id'])
export class VideoEntity extends BaseEntity {
  @Index({ unique: true }) // 定义全文索引
  @Column({ comment: '影片标题', length: 512, nullable: true })
  title: string;

  @Column({ comment: '影片副标题', length: 512, nullable: true })
  sub_title: string;

  @Column({ comment: '是否vip', nullable: true, default: 0 })
  vip: number;

  @Index({ fulltext: true }) // 定义全文索引
  @Column({ comment: '影片标签', length: 191, nullable: true })
  video_tag: string;

  @Column({ comment: '影片类型', length: 191, nullable: true })
  video_class: string;
  //添加索引
  @Index()
  @Column({ comment: '分类', nullable: true })
  category_id: number;
  @Column({ comment: '父级分类', nullable: true })
  category_pid: number;
  @Column({ comment: '影片封面图', type: 'text', nullable: true })
  surface_plot: string;
  @Column({
    comment: '是否轮播',
    type: 'bigint',
    nullable: true,
    default: 2,
  })
  cycle: number;
  @Column({
    comment: '轮播图片',
    type: 'text',
    nullable: true,
  })
  cycle_img: string;
  @Index({ fulltext: true }) // 定义全文索引
  @Column({ comment: '导演', type: 'text', nullable: true })
  directors: string;
  @Index({ fulltext: true }) // 定义全文索引
  @Column({ comment: '演员', type: 'text', nullable: true })
  actors: string;
  @Column({
    comment: 'imd评分.百分制',
    default: _.random(0, 100),
  })
  imdb_score: number;
  @Column({
    comment: 'iimd评分ID',
    length: 256,
    nullable: true,
    default: 0,
  })
  imdb_score_id: string;
  @Index()
  @Column({
    comment: '豆瓣评分.百分制',
    nullable: true,
    type: 'int',
    default: _.random(10, 100),
  })
  douban_score: number;
  @Column({
    comment: '豆瓣评分ID',
    nullable: true,
  })
  douban_score_id: string;
  @Column({
    comment: '简介',
    type: 'text',
    nullable: true,
  })
  introduce: string;
  @Index()
  @Column({
    comment: '总人气',
    type: 'bigint',
    default: _.random(10000, 999999),
  })
  popularity: number;
  @Index()
  @Column({
    comment: '日人气',
    type: 'bigint',
    default: _.random(10000, 999999),
  })
  popularity_day: number;
  @Index()
  @Column({
    comment: '周人气',
    type: 'bigint',
    default: _.random(10000, 999999),
  })
  popularity_week: number;
  @Index()
  @Column({
    comment: '月人气',
    type: 'bigint',
    default: _.random(10000, 999999),
  })
  popularity_month: number;
  @Index()
  @Column({
    comment: '总人气',
    type: 'bigint',
    default: _.random(10000, 999999),
  })
  popularity_sum: number;
  @Column({
    comment: '连载状态',
    length: 256,
    nullable: true,
  })
  note: string;
  @Index()
  @Column({
    comment: '年份',
    default: 2000,
  })
  @Index()
  year: number;
  @Column({
    comment: '状态',
    nullable: true,
    type: 'bigint',
  })
  status: number;
  @Column({
    comment: '时长(单位s)',
    nullable: true,
    type: 'bigint',
  })
  duration: number;
  @Index()
  @Column({
    comment: '自定义地区',
    nullable: true,
  })
  region: number;
  @Index()
  @Column({
    comment: '自定义语言',
    nullable: true,
  })
  language: number;
  @Column({
    comment: '总集数',
    nullable: true,
    default: 1,
    type: 'bigint',
  })
  number: number;
  @Column({
    comment: '更新集数',
    nullable: true,
    default: 1,
    type: 'bigint',
  })
  total: number;
  @Column({
    comment: '横屏海报',
    nullable: true,
    type: 'text',
  })
  horizontal_poster: string;
  @Column({
    comment: '备注',
    nullable: true,
    type: 'text',
  })
  remarks: string;
  @Column({
    comment: '竖屏海报',
    nullable: true,
    type: 'text',
  })
  vertical_poster: string;
  @Column({
    comment: '发行商',
    nullable: true,
    type: 'text',
  })
  publish: string;
  @Column({
    comment: '上映日期',
    nullable: true,
    type: 'text',
  })
  pubdate: string;
  @Column({
    comment: '序列号',
    nullable: true,
    type: 'text',
  })
  serial_number: string;
  @Column({
    comment: '截屏',
    nullable: true,
    type: 'text',
  })
  screenshot: string;
  @Column({
    comment: '是否连载完毕',
    nullable: true,
    type: 'tinyint',
  })
  end: number;
  @Column({
    comment: '单位',
    nullable: true,
    length: 32,
  })
  unit: string;
  @Column({
    comment: '采集的源地址',
    nullable: true,
    type: 'longtext',
  })
  play_url: string;
  @Index()
  @Column({
    comment: '是否入库',
    nullable: true,
    default: 0, // 默认值是0，
    type: 'int',
  })
  play_url_put_in: number;
  @Index()
  @Column({ comment: '资源id', nullable: true })
  collection_id: number;

  @Index()
  @Column({ comment: '顶数', nullable: true })
  up: number;

  @Index()
  @Column({ comment: '踩数', nullable: true })
  down: number;

  @Index()
  @Column({ comment: 'VIP集数', default: 0 })
  vipNumber: number;

  @Column({ comment: '资源名称', nullable: true, length: 256 })
  collection_name: string;

  @Index()
  @Column({ comment: '搜索榜单分类', nullable: true })
  searchRecommendType: number;

  @Index()
  @Column({ comment: '排序', default: 0 })
  sort: number;
}
