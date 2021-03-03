import { Get, Inject, Provide } from '@midwayjs/decorator';
import { Context } from 'egg';
import { CoolController, BaseController } from 'midwayjs-cool-core';

/**
 * 欢迎界面
 */
@Provide()
@CoolController('/')
export class WelcomeController extends BaseController {
  @Inject()
  ctx: Context;

  @Get('/')
  public async welcome() {
    await this.ctx.render('welcome', { text: 'HELLO COOL-ADMIN' });
  }
}
