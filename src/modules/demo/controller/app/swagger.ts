import { Param, Post, Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';

/**
 * swagger 文档
 */
@Provide()
@CoolController(null, {
  tagName: 'swagger demo',
})
export class AppSwaggerController extends BaseController {
  @Post('/create', { summary: '创建' })
  async create(@Param('id') id: number) {
    return this.ok(id);
  }
}
