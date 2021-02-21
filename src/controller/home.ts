import { Get, Provide, Inject, Query, Body, ALL, Post, Validate } from '@midwayjs/decorator';
import { CoolController, CoolCache, BaseController, RESCODE } from 'midwayjs-cool-core';
//import { InjectEntityModel } from '@midwayjs/orm';
import { User } from '../entity/user';
import { TestDTO } from '../dto/test';

@Provide()
@CoolController({
  api: ['info', 'add'],
  entity: User,
  infoIgnoreProperty: ['age']
})
export class HomeController extends BaseController {
  @Inject('cool:cache')
  coolCache: CoolCache;

  @Get('/1')
  async home(@Query() data: string) {
    //console.log(this.coolCache)
    await this.coolCache.set('a', data);
    return await this.coolCache.get('a');
  }

  @Post('/2')
  async 2(@Body(ALL) test: TestDTO) {
    return this.fail('哈哈', RESCODE.VALIDATEFAIL);
  }
}
