import { DictInfoEntity } from './../../entity/info';
import { Body, Inject, Post, Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { DictInfoService } from '../../service/info';

/**
 * 字典信息
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: DictInfoEntity,
  service: DictInfoService,
  listQueryOp: {
    fieldEq: ['typeId'],
    keyWordLikeFields: ['name'],
    addOrderBy: {
      createTime: 'ASC',
    },
  },
})
export class AdminDictInfoController extends BaseController {
  @Inject()
  dictInfoService: DictInfoService;

  @Post('/data', { summary: '获得字典数据' })
  async data(@Body('types') types: string[] = []) {
    return this.ok(await this.dictInfoService.data(types));
  }
}
