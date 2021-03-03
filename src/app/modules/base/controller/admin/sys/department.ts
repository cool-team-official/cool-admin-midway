import { ALL, Body, Inject, Post, Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from 'midwayjs-cool-core';
import { BaseSysDepartmentEntity } from '../../../entity/sys/department';
import { BaseSysDepartmentService } from '../../../service/sys/department';

/**
 * 部门
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'list'],
  entity: BaseSysDepartmentEntity,
  service: BaseSysDepartmentService,
})
export class BaseDepartmentController extends BaseController {
  @Inject()
  baseDepartmentService: BaseSysDepartmentService;

  /**
   * 部门排序
   */
  @Post('/order')
  async order(@Body(ALL) params: any) {
    await this.baseDepartmentService.order(params);
    return this.ok();
  }
}
