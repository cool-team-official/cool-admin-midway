import { Get, Provide, Query } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { CreateApiDoc } from '@midwayjs/swagger';

/**
 * swagger
 */
@Provide()
@CoolController(null, {
  tagName: 'swagger 文档',
  description: 'swagger 文档演示',
})
export class DemoSwaggerController extends BaseController {
  @CreateApiDoc()
    .summary('hello 接口')
    .description('hello 接口功能描述')
    .param('姓名', { required: true })
    .param('年龄', { required: true })
    .param('简介', { required: false })
    .build()
  @Get('/hello')
  async hello(
    @Query() name: string,
    @Query() age: number,
    @Query() desc: string
  ) {
    return this.ok(`你好：${name}!! ${age} ${desc}`);
  }
}
