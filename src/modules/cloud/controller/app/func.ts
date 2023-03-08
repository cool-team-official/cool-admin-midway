import { Body, Post, Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';

/**
 * 云函数
 */
@Provide()
@CoolController()
export class AppCloudFuncController extends BaseController {
  @Post('/invoke', { summary: '调用云函数' })
  async invoke(@Body() body) {}
}
