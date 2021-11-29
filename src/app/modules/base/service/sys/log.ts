import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { Context } from 'egg';
import * as _ from 'lodash';
import { BaseSysLogEntity } from '../../entity/sys/log';
import * as moment from 'moment';
import { Utils } from '../../../../comm/utils';
import { BaseSysConfService } from './conf';

/**
 * 描述
 */
@Provide()
export class BaseSysLogService extends BaseService {
  @Inject()
  ctx: Context;

  @Inject()
  utils: Utils;

  @InjectEntityModel(BaseSysLogEntity)
  baseSysLogEntity: Repository<BaseSysLogEntity>;

  @Inject()
  baseSysConfService: BaseSysConfService;

  /**
   * 记录
   * @param url URL地址
   * @param params 参数
   * @param userId 用户ID
   */
  async record(context: Context, url, params, userId) {
    const ip = await this.utils.getReqIP(context);
    const sysLog = new BaseSysLogEntity();
    sysLog.userId = userId;
    sysLog.ip = typeof ip === 'string' ? ip : ip.join(',');
    const ipAddrArr = [];
    for (const e of sysLog.ip.split(','))
      ipAddrArr.push(await await this.utils.getIpAddr(context, e));
    sysLog.ipAddr = ipAddrArr.join(',');
    sysLog.action = url;
    if (!_.isEmpty(params)) {
      sysLog.params = JSON.stringify(params);
    }
    await this.baseSysLogEntity.insert(sysLog);
  }

  /**
   * 日志
   * @param isAll 是否清除全部
   */
  async clear(isAll?) {
    if (isAll) {
      await this.baseSysLogEntity.clear();
      return;
    }
    const keepDay = await this.baseSysConfService.getValue('logKeep');
    if (keepDay) {
      const beforeDate = `${moment()
        .add(-keepDay, 'days')
        .format('YYYY-MM-DD')} 00:00:00`;
      await this.baseSysLogEntity
        .createQueryBuilder()
        .where('createTime < :createTime', { createTime: beforeDate });
      await this.nativeQuery(
        ' delete from base_sys_log where createTime < ? ',
        [beforeDate]
      );
    } else {
      await this.baseSysLogEntity.clear();
    }
  }
}
