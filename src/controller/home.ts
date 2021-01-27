import { BaseController } from '@midwayjs/cool-core';
import { Controller, Get, Query, Provide } from '@midwayjs/decorator';
import { User } from '../model/user';
import { Repository } from 'typeorm';
import { InjectEntityModel } from '@midwayjs/orm';

@Provide()
@Controller('/test')
export class HomeController extends BaseController {

  @InjectEntityModel(User)
  userModel: Repository<User>

  getModel() {
    return this.userModel;
  }

}
