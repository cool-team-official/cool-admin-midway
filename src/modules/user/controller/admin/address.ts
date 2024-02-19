import { CoolController, BaseController } from '@cool-midway/core';
import { UserAddressEntity } from '../../entity/address';

/**
 * 用户-地址
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: UserAddressEntity,
})
export class AdminUserAddressesController extends BaseController {}
