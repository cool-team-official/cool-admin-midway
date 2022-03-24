import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';

/**
 * 缓存
 */
@Provide()
export class DemoGoodsService extends BaseService {
  async test() {
    console.log('调用');
  }
}
