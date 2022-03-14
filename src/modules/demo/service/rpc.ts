import { App, Provide } from '@midwayjs/decorator';
import { DemoGoodsEntity } from '../entity/goods';
import { IMidwayApplication } from '@midwayjs/core';
import { BaseRpcService, CoolRpcService } from '@cool-midway/rpc';

@Provide()
@CoolRpcService({
  entity: DemoGoodsEntity,
  method: ['info', 'add', 'page'],
})
export class DemoRpcService extends BaseRpcService {
  @App()
  app: IMidwayApplication;

  async info(params) {
    return params;
  }
  async getUser() {
    return {
      uid: '123',
      username: 'mockedName',
      phone: '12345678901',
      email: 'xxx.xxx@xxx.com',
    };
  }
}
