import { Body, Inject, Post, Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from 'midwayjs-cool-core';
import { BaseSysUserEntity } from '../../../entity/sys/user';
import { BaseSysUserService } from '../../../service/sys/user';

/**
 * 系统用户
 */
@Provide()
@CoolController({
    api: ['add', 'delete', 'update', 'info', 'list', 'page'],
    entity: BaseSysUserEntity
})
export class BaseSysUserController extends BaseController {

    @Inject()
    BaseSysUserService: BaseSysUserService;

    /**
     * 移动部门
     */
    @Post('/move')
    async move(@Body() departmentId: number, @Body() userIds: []) {
        await this.BaseSysUserService.move(departmentId, userIds);
        this.ok();
    }

}