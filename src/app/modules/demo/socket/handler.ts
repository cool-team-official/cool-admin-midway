import { Provide } from '@midwayjs/decorator';
import { CoolSocket, SocketEnvent } from '@cool-midway/socket';
import { Socket } from 'socket.io';

/**
 * socket的事件
 */
@Provide()
@CoolSocket('/')
export class SocketHandler {
  /**
   * 连接成功
   * @param data
   */
  @SocketEnvent()
  async connection(socket: Socket) {
    console.log('socket事件', socket.id, socket.handshake.query);
  }
}
