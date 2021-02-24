import { Body, Provide, ALL, Inject, Post, Get, Query } from '@midwayjs/decorator';
import { CoolController, BaseController } from 'midwayjs-cool-core';
import { LoginDTO } from '../../dto/login';
import { BaseSysLoginService } from '../../service/sys/login';

/**
 * Base 通用接口 一般写不需要权限过滤的接口
 */
@Provide()
@CoolController()
export class BaseCommController extends BaseController {

    @Inject()
    baseSysLoginService: BaseSysLoginService;

    /**
     * 登录
     * @param login 
     */
    @Post('/login')
    async login(@Body(ALL) login: LoginDTO) {
        return this.ok(await this.baseSysLoginService.login(login))
    }

    /**
     * 获得验证码
     */
    @Get('/captcha')
    async captcha(@Query() type: string, @Query() width: number, @Query() height: number) {
        return this.ok(await this.baseSysLoginService.captcha(type, width, height));
    }

}