import { Inject, Controller, Provide, Query, Get } from '@midwayjs/decorator';
import { Context } from 'egg';
import { UserService } from '../service/user';
import { Repository } from 'typeorm';
import { User } from '../model/user';
import { InjectEntityModel } from '@midwayjs/orm';
import axios from 'axios';

@Provide()
@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @InjectEntityModel(User)
  userModel: Repository<User>;

  @Get('/get_user')
  async getUser(@Query() uid) {
    // const user = await this.userService.getUser({ uid });

    // console.log(await this.userModel.findOne({id: 1}))

   // const result = await axios.get('https://docs-admin-cloud.cool-js.com/api/get_user?uid=1')
    let index = 0;
    while(true){
      try {
        index++;
        const startTime = Date.now();
        const result = await axios.get('https://m.cool-js.com/api/get_user?uid=1')
        console.log(index,'请求时间', Date.now() - startTime, result.data);
      } catch (error) {
        console.log(6666666666666666666666666666666666666666)
        continue;
      }
    }

   // return { success: true, message: 'OK', data: {uid, a: result.data} };
  }
}
