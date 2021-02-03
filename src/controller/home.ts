import { Get, Query, Provide } from '@midwayjs/decorator';
import { User } from '../model/user';
import { Repository } from 'typeorm';
import { InjectEntityModel } from '@midwayjs/orm';
import { BaseController, Controller } from 'midwayjs-cool-core';

//import {Controller} from './controller';

@Provide()
@Controller()
export class HomeController extends BaseController{

  @InjectEntityModel(User)
  userModel: Repository<User>

  getModel() {
    return this.userModel;
  }

   // 根据ID 获得单条信息
   @Get("/info")
   async info(@Query() id) {
       return id;
   }

}
