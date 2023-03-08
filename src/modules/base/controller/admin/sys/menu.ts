import { Body, Inject, Post, Provide } from '@midwayjs/decorator';
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

  @Post('/parse', { summary: '解析' })
  async parse(
    @Body('entity') entity: string,
    @Body('controller') controller: string,
    @Body('module') module: string
  ) {
    return this.ok(
      await this.baseSysMenuService.parse(entity, controller, module)
    );
  }

  @Post('/create', { summary: '创建代码' })
  async create(@Body() body) {
    await this.baseSysMenuService.create(body);
    return this.ok();
  }
}
