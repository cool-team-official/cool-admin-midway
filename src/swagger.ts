import { Controller, Get, Inject } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';

/**
 * 欢迎界面
 */
@Controller('/')
export class WelcomeController {
  @Inject()
  ctx: Context;

  @Get('/swagger', { summary: 'swagger界面' })
  public async swagger() {
    await this.ctx.render('swagger', {});
  }
}
