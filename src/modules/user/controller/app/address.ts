import { Get, Inject, Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { UserAddressEntity } from '../../entity/address';
import { UserAddressService } from '../../service/address';

/**
 * 地址
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: UserAddressEntity,
  service: UserAddressService,
  insertParam: ctx => {
    return {
      userId: ctx.user.id,
    };
  },
  pageQueryOp: {
    where: async ctx => {
      return [['userId =:userId', { userId: ctx.user.id }]];
    },
    addOrderBy: {
      isDefault: 'DESC',
    },
  },
})
export class AppUserAddressController extends BaseController {
  @Inject()
  userAddressService: UserAddressService;

  @Inject()
  ctx;

  @Get('/default', { summary: '默认地址' })
  async default() {
    return this.ok(await this.userAddressService.default(this.ctx.user.id));
  }
}
