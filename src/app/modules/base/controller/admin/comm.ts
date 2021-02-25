import { Provide, Inject, Get, Post, Body, ALL } from '@midwayjs/decorator';
import { Context } from 'egg';
import { CoolController, BaseController } from 'midwayjs-cool-core';
import { BaseSysUserEntity } from '../../entity/sys/user';
import { BaseSysPermsService } from '../../service/sys/perms';
import { BaseSysUserService } from '../../service/sys/user';

/**
 * Base 通用接口 一般写不需要权限过滤的接口
 */
@Provide()
@CoolController()
export class BaseCommController extends BaseController {

    @Inject()
    baseSysUserService: BaseSysUserService;

    @Inject()
    baseSysPermsService: BaseSysPermsService;

    @Inject()
    ctx: Context;

    /**
     * 获得个人信息
     */
    @Get('/person')
    public async person() {
        return this.ok(await this.baseSysUserService.person());
    }

    /**
     * 修改个人信息
     */
    @Post('/personUpdate')
    public async personUpdate(@Body(ALL) user: BaseSysUserEntity) {
        await this.baseSysUserService.personUpdate(user);
        return this.ok();
    }

    /**
     * 权限菜单
     */
    @Get('/permmenu')
    public async permmenu() {
        return this.ok(await this.baseSysPermsService.permmenu(this.ctx.admin.roleIds));
    }

}