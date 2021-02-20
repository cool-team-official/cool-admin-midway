import { Get, Provide, Inject, Query } from '@midwayjs/decorator';
import { CoolController, CoolCache } from 'midwayjs-cool-core';
//import { InjectEntityModel } from '@midwayjs/orm';
import { User } from '../entity/user';


@Provide()
@CoolController({ api: ['add'], model: User })
export class HomeController {
  @Inject('cool:cache')
  coolCache: CoolCache;

  @Get('/1')
  async home(@Query() data: string) {
    //console.log(this.coolCache)
    await this.coolCache.set('a', data);
    return await this.coolCache.get('a');
  }
}
