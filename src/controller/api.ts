import { Inject, Controller, Provide, Query, Get } from '@midwayjs/decorator';
import { Context } from 'egg';
import { UserService } from '../service/user';
import { Repository } from 'typeorm';
import { User } from '../model/user';
import { InjectEntityModel } from '@midwayjs/orm';

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
    const user = await this.userService.getUser({ uid });

    console.log(await this.userModel.findOne({id: 1}))

    return { success: true, message: 'OK', data: user };
  }
}
