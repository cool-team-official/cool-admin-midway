import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService } from 'midwayjs-cool-core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { Context } from 'egg';
import * as _ from 'lodash';
import { AdminSysLogEntity } from '../../entity/sys/log';
import * as moment from 'moment';

/**
 * 描述
 */
@Provide()
export class AdminSysLogService extends BaseService {

    @Inject()
    ctx: Context;

    @InjectEntityModel(AdminSysLogEntity)
    adminSysLogEntity: Repository<AdminSysLogEntity>;

    /**
     * 记录
     * @param url URL地址
     * @param params 参数
     * @param userId 用户ID
     */
    async record(url, params, userId) {
        const ip = await this.ctx.helper.getReqIP();
        const sysLog = new AdminSysLogEntity();
        sysLog.userId = userId;
        sysLog.ip = ip;
        const ipAddrArr = new Array();
        for (const e of ip.split(',')) ipAddrArr.push(await this.ctx.helper.getIpAddr(e));
        sysLog.ipAddr = ipAddrArr.join(',');
        sysLog.action = url;
        if (!_.isEmpty(params)) {
            sysLog.params = JSON.stringify(params);
        }
        await this.adminSysLogEntity.insert(sysLog);
    }

    /**
     * 日志
     * @param isAll 是否清除全部
     */
    async clear(isAll?) {
        if (isAll) {
            await this.adminSysLogEntity.clear();
            return;
        }
        const keepDay = await this.ctx.service.sys.conf.getValue('logKeep');
        if (keepDay) {
            const beforeDate = `${moment().subtract(keepDay, 'days').format('YYYY-MM-DD')} 00:00:00`;
            await this.adminSysLogEntity.createQueryBuilder()
                .where('createTime < :createTime', { createTime: beforeDate })
            await this.nativeQuery(' delete from sys_log where createTime < ? ', [beforeDate]);
        } else {
            await this.adminSysLogEntity.clear();
        }
    }
}