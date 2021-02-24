import { Provide, Post, Inject } from '@midwayjs/decorator';
import { CoolController, BaseController } from 'midwayjs-cool-core';
import { BaseSysLogEntity } from '../../../entity/sys/log';
import { BaseSysUserEntity } from '../../../entity/sys/user';
import { BaseSysLogService } from '../../../service/sys/log';

/**
 * 系统日志
 */
@Provide()
@CoolController({
    api: ['page'],
    entity: BaseSysLogEntity,
    pageQueryOp: {
        keyWordLikeFields: ['b.name', 'a.params', 'a.ipAddr'],
        select: ['a.*, b.name'],
        leftJoin: [{
            entity: BaseSysUserEntity,
            alias: 'b',
            condition: 'a.userId = b.id'
        }]
    }
})
export class BaseSysLogController extends BaseController {

    @Inject()
    adminSysLogService: BaseSysLogService;

    /**
     * 清空日志
     */
    @Post('/clear')
    public async clear() {
        await this.adminSysLogService.clear(true);
        this.ok();
    }

}