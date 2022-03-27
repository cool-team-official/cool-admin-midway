import {
  WSController,
  OnWSConnection,
  Inject,
  OnWSMessage,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/socketio';
/**
 * 测试
 */
@WSController('/')
export class HelloController {
  @Inject()
  ctx: Context;

  @OnWSConnection()
  async onConnectionMethod() {
    console.log('on client connect', this.ctx.id);
    this.ctx.emit('data', '连接成功');
  }

  @OnWSMessage('myEvent')
  async gotMessage(data) {
    console.log('on data got', this.ctx.id, data);
  }
}
