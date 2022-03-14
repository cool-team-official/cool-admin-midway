import { Inject, Post, Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { TestEsIndex } from '../../es/test';

/**
 * elasticsearch
 */
@Provide()
@CoolController()
export class AppDemoEsController extends BaseController {
  @Inject()
  testEsIndex: TestEsIndex;

  @Post('/test')
  async test() {
    // 新增与修改
    await this.testEsIndex.upsert({
      name: '啊平',
      age: 18,
    });
    return this.ok(await this.testEsIndex.find());
  }
}
