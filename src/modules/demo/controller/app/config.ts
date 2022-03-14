import { Config, Get, Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';

/**
 * 配置
 */
@Provide()
@CoolController()
export class DemoConfigController extends BaseController {
  //获得模块配置，格式： module.模块名，模块文件夹名称，如demo
  @Config('module.demo')
  demoConfig;

  @Get('/get')
  async get() {
    return this.ok(this.demoConfig);
  }
}
