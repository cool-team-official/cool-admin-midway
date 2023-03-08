import { CloudDBService } from './../../service/db';
import { CloudDBEntity } from './../../entity/db';
import { Body, Inject, Post, Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';

/**
 * 云数据库
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: CloudDBEntity,
  service: CloudDBService,
  pageQueryOp: {
    fieldEq: ['status'],
    keyWordLikeFields: ['name'],
  },
})
export class CloudDBController extends BaseController {
  @Inject()
  cloudDBService: CloudDBService;

  @Post('/initEntity', { summary: '初始化Entity' })
  async initEntity() {
    await this.cloudDBService.initEntity();
    return this.ok();
  }

  @Post('/data', { summary: '数据操作' })
  async data(@Body() body) {
    const { id, method, params } = body;
    return this.ok(await this.cloudDBService.data(id, method, params));
  }
}
