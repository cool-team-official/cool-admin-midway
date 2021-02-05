import { Get, Provide, Inject, Query } from '@midwayjs/decorator';
import { CoolController, CoolCache } from 'midwayjs-cool-core';

@Provide()
@CoolController()
export class HomeController {
  @Inject('cool:cache')
  coolCache: CoolCache;

  @Get('/1')
  async home(@Query() data: string) {
    console.log(await this.coolCache.set('a', data, 10000))
    return await this.coolCache.get('a');
  }
}
