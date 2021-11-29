import { Get, Inject, Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { BaseSysMenuEntity } from '../../../entity/sys/menu';
import { BaseSysMenuService } from '../../../service/sys/menu';

/**
 * 菜单
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: BaseSysMenuEntity,
  service: BaseSysMenuService,
})
export class BaseSysMenuController extends BaseController {
  @Inject()
  baseSysMenuService: BaseSysMenuService;

  @Inject('cool:eps')
  eps;

  /**
   * 实体信息与路径
   * @returns
   */
  @Get('/eps')
  public async getEps() {
    return this.ok(this.eps);
  }
}
