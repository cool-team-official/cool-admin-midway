import { Body, Inject, Post, Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from 'midwayjs-cool-core';
import { AdminSysUserEntity } from '../../entity/sys/user';
import { AdminSysUserService } from '../../service/sys/user';

/**
 * 系统用户
 */
@Provide()
@CoolController({
    api: ['add', 'delete', 'update', 'info', 'list', 'page'],
    entity: AdminSysUserEntity
})
export class AdminSysUserController extends BaseController {

    @Inject()
    adminSysUserService: AdminSysUserService;

    /**
     * 移动部门
     */
    @Post('/move')
    async move(@Body() departmentId: number, @Body() userIds: []) {
        await this.adminSysUserService.move(departmentId, userIds);
        this.ok();
    }

}