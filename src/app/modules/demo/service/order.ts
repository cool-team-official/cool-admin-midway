import { Provide } from '@midwayjs/decorator';
import { BaseService } from 'midwayjs-cool-core';

/**
 * 描述
 */
@Provide()
export class DemoOrderService extends BaseService {
  /**
   * 描述
   */
  async test() {
    console.log('我被调用了');
  }
}
