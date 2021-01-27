import { Provide } from '@midwayjs/decorator';
import { IUserOptions } from '../interface';
import { BaseService } from '@midwayjs/cool-core'

@Provide()
export class UserService extends BaseService {

  async getUser(options: IUserOptions) {
    return {
      uid: options.uid,
      username: 'mockedName',
      phone: '12345678901',
      email: 'xxx.xxx@xxx.com',
    };
  }
}
