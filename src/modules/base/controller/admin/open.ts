import { Provide, Body, Inject, Post, Get, Query } from '@midwayjs/decorator';
import { CoolController, BaseController, CoolEps } from '@cool-midway/core';
import { LoginDTO } from '../../dto/login';
import { BaseSysLoginService } from '../../service/sys/login';
import { BaseSysParamService } from '../../service/sys/param';
import { Context } from '@midwayjs/koa';
import { Validate } from '@midwayjs/validate';

/**
 * 不需要登录的后台接口
 */
@Provide()
@CoolController()
export class BaseOpenController extends BaseController {
  @Inject()
  baseSysLoginService: BaseSysLoginService;

  @Inject()
  baseSysParamService: BaseSysParamService;

  @Inject()
  ctx: Context;

  @Inject()
  eps: CoolEps;

  /**
   * 实体信息与路径
   * @returns
   */
  @Get('/eps', { summary: '实体信息与路径' })
  public async getEps() {
    return this.ok(this.eps.admin);
  }

  /**
   * 根据配置参数key获得网页内容(富文本)
   */
  @Get('/html', { summary: '获得网页内容的参数值' })
  async htmlByKey(@Query('key') key: string) {
    this.ctx.body = await this.baseSysParamService.htmlByKey(key);
  }

  /**
   * 登录
   * @param login
   */
  @Post('/login', { summary: '登录' })
  @Validate()
  async login(@Body() login: LoginDTO) {
    return this.ok(await this.baseSysLoginService.login(login));
  }

  /**
   * 获得验证码
   */
  @Get('/captcha', { summary: '验证码' })
  async captcha(
    @Query('type') type: string,
    @Query('width') width: number,
    @Query('height') height: number
  ) {
    return this.ok(await this.baseSysLoginService.captcha(type, width, height));
  }

  /**
   * 刷新token
   */
  @Get('/refreshToken', { summary: '刷新token' })
  async refreshToken(@Query('refreshToken') refreshToken: string) {
    return this.ok(await this.baseSysLoginService.refreshToken(refreshToken));
  }
}
