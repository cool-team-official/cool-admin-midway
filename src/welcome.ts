import { CoolCloudDb } from '@cool-midway/cloud';
import { App, Controller, Get, Inject } from '@midwayjs/decorator';
import { Context, Application } from '@midwayjs/koa';
import { TypeORMDataSourceManager } from '@midwayjs/typeorm';

/**
 * 欢迎界面
 */
@Controller('/')
export class WelcomeController {
  @Inject()
  ctx: Context;

  @App()
  app: Application;

  @Inject()
  typeORMDataSourceManager: TypeORMDataSourceManager;

  @Inject()
  coolCloudDb: CoolCloudDb;

  @Get('/')
  public async welcome() {
    await this.ctx.render('welcome', {
      text: 'HELLO COOL-ADMIN 6.x 一个项目用COOL就够了！！！',
    });
  }
}
