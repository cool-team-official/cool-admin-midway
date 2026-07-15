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

import { BaseService } from '@cool-midway/core';
import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Between, Not, Repository } from 'typeorm';
import { UserInfoEntity } from '../../user/entity/info';
import { BaseSysLogEntity } from '../../base/entity/sys/log';
import { ViewsEntity } from '../../user/entity/views';
import { VideoEntity } from '../../video/entity/videos';
import { RedisService } from '@midwayjs/redis';
import { DictInfoService } from '../../dict/service/info';
import { PlayLineEntity } from '../../video/entity/play_line';
import { FeedbackInfoEntity } from '../../application/entity/feedbackInfo';

/**
 * 用户信息
 */
@Provide()
export class EChartService extends BaseService {
  @InjectEntityModel(UserInfoEntity)
  userInfoEntity: Repository<UserInfoEntity>;

  @InjectEntityModel(FeedbackInfoEntity)
  feedbackInfoEntity: Repository<FeedbackInfoEntity>;

  @InjectEntityModel(BaseSysLogEntity)
  sysLogEntity: Repository<BaseSysLogEntity>;

  @InjectEntityModel(ViewsEntity)
  viewsEntity: Repository<ViewsEntity>;

  @InjectEntityModel(PlayLineEntity)
  playLineEntity: Repository<PlayLineEntity>;

  @InjectEntityModel(VideoEntity)
  videoEntity: Repository<VideoEntity>;

  @Inject()
  dictInfoService: DictInfoService;

  @Inject()
  redisService: RedisService;

  // 统计user的总数量和今日新增数量
  async user() {
    // 并行执行两个查询，提升性能
    const [total, today] = await Promise.all([
      this.userInfoEntity.count(),
      this.userInfoEntity.countBy({
        createTime: Between(
          new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          new Date()
        ),
      }),
    ]);

    return { total, today };
  }

  //统计playLineEntity status =0的数量 和占比(百分比)
  async playLine() {
    // 并行执行两个查询，提升性能
    const [fail, success] = await Promise.all([
      this.playLineEntity.countBy({ status: 0 }),
      this.playLineEntity.countBy({ status: 1 }),
    ]);

    return {
      fail,
      success,
      percent: (fail / (success + fail)) * 100,
    };
  }

  //统计feedbackInfoEntity feedbackType =0的数量 和占比(百分比)
  async feedback() {
    //计算feedbackInfoEntity 周同比 日同比
    // 并行执行所有查询，提升性能
    const [week, day, sum] = await Promise.all([
      this.feedbackInfoEntity.countBy({
        createTime: Between(
          new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
          new Date()
        ),
      }),
      this.feedbackInfoEntity.countBy({
        createTime: Between(
          new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          new Date()
        ),
      }),
      this.feedbackInfoEntity.count(),
    ]);

    return { week, day, sum };
  }

  // 统计访问的总数量和今日新增数量
  async visit() {
    // 并行执行所有查询，提升性能
    const [totalResult, todayResult, hourData] = await Promise.all([
      // 统计不重复的IP数量（过滤本地IP）
      this.sysLogEntity
        .createQueryBuilder('log')
        .select('COUNT(DISTINCT log.ip)', 'count')
        .where('log.ip IS NOT NULL')
        .andWhere('log.ip NOT LIKE :localhost1', { localhost1: '127.0.0.1%' })
        .andWhere('log.ip NOT LIKE :localhost2', { localhost2: '::1%' })
        .andWhere('log.ip NOT LIKE :localhost3', {
          localhost3: '::ffff:127.0.0.1%',
        })
        .andWhere('log.ip NOT LIKE :private1', { private1: '192.168.%' })
        .andWhere('log.ip NOT LIKE :private2', { private2: '10.%' })
        .andWhere('log.ip NOT REGEXP :private3Regex', {
          private3Regex: '^172\\.(1[6-9]|2[0-9]|3[0-1])\\.',
        })
        .getRawOne(),
      // 统计今日不重复的IP数量（过滤本地IP）
      this.sysLogEntity
        .createQueryBuilder('log')
        .select('COUNT(DISTINCT log.ip)', 'count')
        .where('log.ip IS NOT NULL')
        .andWhere('DATE(log.createTime) = DATE(:today)', {
          today: new Date(),
        })
        .andWhere('log.ip NOT LIKE :localhost1', { localhost1: '127.0.0.1%' })
        .andWhere('log.ip NOT LIKE :localhost2', { localhost2: '::1%' })
        .andWhere('log.ip NOT LIKE :localhost3', {
          localhost3: '::ffff:127.0.0.1%',
        })
        .andWhere('log.ip NOT LIKE :private1', { private1: '192.168.%' })
        .andWhere('log.ip NOT LIKE :private2', { private2: '10.%' })
        .andWhere('log.ip NOT REGEXP :private3Regex', {
          private3Regex: '^172\\.(1[6-9]|2[0-9]|3[0-1])\\.',
        })
        .getRawOne(),
      // 获取按小时区间的数据
      this.getUserViewsByHourIntervals(),
    ]);

    return {
      total: Number(totalResult?.count || 0),
      today: Number(todayResult?.count || 0),
      data: hourData,
    };
  }

  /**
   * sysLogEntity实体中的params字段为json数据 统计params中keyWord字段不为空的记录 并统计出对应的次数
   */
  async keyWord() {
    return await this.sysLogEntity
      .createQueryBuilder('sysLog')
      .select('MAX(sysLog.params)', 'params') // 使用 MAX 聚合函数处理非分组字段
      .addSelect('COUNT(sysLog.id)', 'count')
      .where('sysLog.params IS NOT NULL')
      .andWhere("JSON_EXTRACT(sysLog.params, '$.keyWord') IS NOT NULL")
      .andWhere("JSON_EXTRACT(sysLog.params, '$.keyWord') != ''") // 过滤掉keyword为空字符串的数据
      .andWhere('sysLog.ip NOT LIKE :localhost1', { localhost1: '127.0.0.1%' })
      .andWhere('sysLog.ip NOT LIKE :localhost2', { localhost2: '::1%' })
      .andWhere('sysLog.ip NOT LIKE :localhost3', {
        localhost3: '::ffff:127.0.0.1%',
      })
      .andWhere('sysLog.ip NOT LIKE :private1', { private1: '192.168.%' })
      .andWhere('sysLog.ip NOT LIKE :private2', { private2: '10.%' })
      .andWhere('sysLog.ip NOT REGEXP :private3Regex', {
        private3Regex: '^172\\.(1[6-9]|2[0-9]|3[0-1])\\.',
      })
      .groupBy("JSON_EXTRACT(sysLog.params, '$.keyWord')") // 修改 GROUP BY 中的 JSON 路径表达式
      .orderBy('count', 'DESC')
      .limit(12)
      .getRawMany();
  }

  // 新增函数：统计 title 出现次数最多的前十条记录（分今日、本周、本月、本年）
  async statisticTitleCount() {
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const endOfToday = new Date(now.setHours(23, 59, 59, 999));

    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31);

    const getTopTitles = async (startTime: Date, endTime: Date) => {
      return await this.viewsEntity
        .createQueryBuilder('view')
        .select('view.title', 'title')
        .addSelect('COUNT(view.title)', 'count')
        .where('view.createTime BETWEEN :startTime AND :endTime', {
          startTime,
          endTime,
        })
        .groupBy('view.title')
        .orderBy('count', 'DESC')
        .limit(10)
        .getRawMany();
    };

    // 并行执行所有时间段的查询，提升性能
    const [today, week, month, year] = await Promise.all([
      getTopTitles(startOfToday, endOfToday),
      getTopTitles(startOfWeek, endOfWeek),
      getTopTitles(startOfMonth, endOfMonth),
      getTopTitles(startOfYear, endOfYear),
    ]);

    return { today, week, month, year };
  }

  //根据视频category_pid分组统计数据并返回
  async videoCategoryPid() {
    const data: any = await this.dictInfoService.data(['video_category']);

    const list = await this.videoEntity
      .createQueryBuilder('video')
      .where({
        category_pid: Not(0),
      })
      .select('video.category_pid', 'category_pid')
      .addSelect('COUNT(video.id)', 'value')
      .groupBy('video.category_pid')
      .getRawMany();
    list.forEach(item => {
      item.name = data.video_category.find(
        item2 => item2.id === item.category_pid
      )?.name;
      item.value = Number(item.value);
    });
    return list;
  }

  // 统计视频的createTime 往后12天的数据量 每一天的新数据量 按天为单位返回
  async videoCreateTime() {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 11); // 获取过去12天的起始日期

    // 并行执行两个查询，提升性能
    const [update, create] = await Promise.all([
      this.videoEntity
        .createQueryBuilder('video')
        .select('DATE(video.updateTime)', 'date') // 按天分组日期格式化成年月日格式
        .addSelect('COUNT(video.id)', 'value') // 统计每天的数据量
        .where('video.updateTime BETWEEN :startDate AND :endDate', {
          startDate,
          endDate: now,
        })
        .groupBy('DATE(video.updateTime)') // 按日期分组
        .orderBy('DATE(video.updateTime)', 'ASC') // 按日期升序排列
        .limit(12) // 限制返回最多12条数据
        .getRawMany(), // 返回原始数据
      this.videoEntity
        .createQueryBuilder('video')
        .select('DATE(video.createTime)', 'date') // 按天分组日期格式化成年月日格式
        .addSelect('COUNT(video.id)', 'value') // 统计每天的数据量
        .where('video.createTime BETWEEN :startDate AND :endDate', {
          startDate,
          endDate: now,
        })
        .andWhere(
          'video.updateTime IS NULL OR video.updateTime = video.createTime'
        ) // 过滤仅包含 createTime 的记录
        .groupBy('DATE(video.createTime)') // 按日期分组
        .orderBy('DATE(video.createTime)', 'ASC') // 按日期升序排列
        .limit(12) // 限制返回最多12条数据
        .getRawMany(), // 返回原始数据
    ]);

    return { update, create };
  }

  //videoEntity play_url_put_in =0 的数量
  async videoPlayUrlPutInCount() {
    return await this.videoEntity.countBy({
      play_url_put_in: 0,
    });
  }

  //调用前面所有的方法并返回数据
  async getData() {
    // 并行执行所有统计函数，大幅提升性能
    const [
      user,
      visit,
      statisticTitleCount,
      videoCategory,
      videoCreateTime,
      keyWord,
      playLine,
      feedback,
      videoPlayUrlPutInCount,
    ] = await Promise.all([
      this.user(),
      this.visit(),
      this.statisticTitleCount(),
      this.videoCategoryPid(),
      this.videoCreateTime(),
      this.keyWord(),
      this.playLine(),
      this.feedback(),
      this.videoPlayUrlPutInCount(),
    ]);

    const data = {
      user,
      visit,
      statisticTitleCount,
      videoCategory,
      videoCreateTime,
      keyWord,
      playLine,
      feedback,
      videoPlayUrlPutInCount,
    };

    // 使用 set 而不是 lpush，更高效且语义更清晰
    await this.redisService.set(
      'video:echarts',
      JSON.stringify(data),
      'EX',
      60 * 60
    );
    return data;
  }

  //将redis的数据返回出去
  async info() {
    // 使用 get 而不是 lpop，lpop 会删除数据，get 只读取不删除
    const data = await this.redisService.get('video:echarts');
    if (data) {
      return JSON.parse(data);
    } else {
      return await this.getData();
    }
  }

  async getUserViewsByHourIntervals() {
    const hourIntervals = [
      '00:00',
      '2:00',
      '4:00',
      '6:00',
      '8:00',
      '10:00',
      '12:00',
      '14:00',
      '16:00',
      '18:00',
      '20:00',
      '22:00',
    ];

    const now = new Date();
    const results = {};

    // 优化：使用并行查询替代串行查询，大幅提升性能
    const queries = hourIntervals.map(async interval => {
      const startTime = new Date(now);
      const endTime = new Date(now);

      // 设置当前小时区间的时间范围
      const [hours] = interval.split(':');
      startTime.setHours(Number(hours), 0, 0, 0);
      endTime.setHours(Number(hours) + 2, 0, 0, 0);

      // 查询对应时间区间的浏览数（过滤本地IP）
      const count = await this.sysLogEntity
        .createQueryBuilder('log')
        .where('log.createTime BETWEEN :startTime AND :endTime', {
          startTime,
          endTime,
        })
        .andWhere('log.ip IS NOT NULL')
        .andWhere('log.ip NOT LIKE :localhost1', { localhost1: '127.0.0.1%' })
        .andWhere('log.ip NOT LIKE :localhost2', { localhost2: '::1%' })
        .andWhere('log.ip NOT LIKE :localhost3', {
          localhost3: '::ffff:127.0.0.1%',
        })
        .andWhere('log.ip NOT LIKE :private1', { private1: '192.168.%' })
        .andWhere('log.ip NOT LIKE :private2', { private2: '10.%' })
        .andWhere(
          '(log.ip NOT LIKE :private3 OR log.ip NOT REGEXP :private3Regex)',
          {
            private3: '172.%',
            private3Regex: '^172\\.(1[6-9]|2[0-9]|3[0-1])\\.',
          }
        )
        .getCount();

      return { interval, count };
    });

    // 并行执行所有查询
    const queryResults = await Promise.all(queries);

    // 将结果存入对应的时间区间
    queryResults.forEach(({ interval, count }) => {
      results[interval] = count;
    });

    return results;
  }
}
