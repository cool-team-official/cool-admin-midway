import { Config, Controller, Get, Inject } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { SwaggerBuilder } from '../builder';
import { BaseController } from '@cool-midway/core';

/**
 * 欢迎界面
 */
@Controller('/swagger')
export class SwaggerIndexController extends BaseController {
  @Inject()
  ctx: Context;

  @Inject()
  swaggerBuilder: SwaggerBuilder;

  @Config('cool.eps')
  epsConfig: boolean;

  @Get('/', { summary: 'swagger界面' })
  public async index() {
    if (!this.epsConfig) {
      return this.fail('Eps未开启');
    }
    await this.ctx.render('swagger', {});
  }

  @Get('/json', { summary: '获得Swagger JSON数据' })
  public async json() {
    if (!this.epsConfig) {
      return this.fail('Eps未开启');
    }
    return this.swaggerBuilder.json;
  }
}
