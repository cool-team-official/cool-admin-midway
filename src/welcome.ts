import { App, Controller, Get, Inject } from '@midwayjs/decorator';
import { Context, Application } from '@midwayjs/koa';

/**
 * 欢迎界面
 */
@Controller('/')
export class WelcomeController {
  @Inject()
  ctx: Context;

  @App()
  app: Application;

  @Get('/')
  public async welcome() {
    await this.ctx.render('welcome', {
      text: 'HELLO COOL-ADMIN v7.0 一个项目用COOL就够了！！！',
    });
  }
}
