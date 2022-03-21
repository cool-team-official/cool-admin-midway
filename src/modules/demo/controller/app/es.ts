import { Inject, Post, Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { TestEsIndex } from '../../es/test';
import { CoolElasticSearch } from '@cool-midway/es';

/**
 * elasticsearch
 */
@Provide()
@CoolController()
export class AppDemoEsController extends BaseController {
  @Inject()
  testEsIndex: TestEsIndex;

  @Inject()
  es: CoolElasticSearch;

  @Post('/test')
  async test() {
    // es 客户端实例
    this.es.client;
    // 新增与修改
    await this.testEsIndex.upsert({
      name: '你好啊你是谁',
      age: 18,
    });
    return this.ok(await this.testEsIndex.find());
  }
}
