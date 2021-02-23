import { Provide, Post, Inject } from '@midwayjs/decorator';
import { CoolController, BaseController } from 'midwayjs-cool-core';
import { AdminSysLogEntity } from '../../entity/sys/log';
import { AdminSysUserEntity } from '../../entity/sys/user';
import { AdminSysLogService } from '../../service/sys/log';

/**
 * 系统日志
 */
@Provide()
@CoolController({
    api: ['page'],
    entity: AdminSysLogEntity,
    pageQueryOp: {
        keyWordLikeFields: ['b.name', 'a.params', 'a.ipAddr'],
        select: ['a.*, b.name'],
        leftJoin: [{
            entity: AdminSysUserEntity,
            alias: 'b',
            condition: 'a.userId = b.id'
        }]
    }
})
export class AdminSysLogController extends BaseController {

    @Inject()
    adminSysLogService: AdminSysLogService;

    /**
     * 清空日志
     */
    @Post('/clear')
    public async clear() {
        await this.adminSysLogService.clear(true);
        this.ok();
    }

}