import { Get, Provide, Inject } from '@midwayjs/decorator';
import { CoolController, CoolCache } from 'midwayjs-cool-core';

@Provide()
@CoolController()
export class Home1Controller {
  @Inject('cool-core:coolCache')
  coolCache: CoolCache;
  @Get('/1')
  async home() {
    const data = await this.coolCache.get('a');
    console.log('获得到的数据', data)
    return data;
  }
}
