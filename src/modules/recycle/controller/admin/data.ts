import { BaseSysUserEntity } from './../../../base/entity/sys/user';
import { RecycleDataEntity } from './../../entity/data';
import { Body, Inject, Post, Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { RecycleDataService } from '../../service/data';

/**
 * 数据回收
 */
@Provide()
@CoolController({
  api: ['info', 'page'],
  entity: RecycleDataEntity,
  pageQueryOp: {
    keyWordLikeFields: ['b.name', 'a.url'],
    select: ['a.*', 'b.name as userName'],
    join: [
      {
        entity: BaseSysUserEntity,
        alias: 'b',
        condition: 'a.userId = b.id',
      },
    ],
  },
})
export class AdminRecycleDataController extends BaseController {
  @Inject()
  recycleDataService: RecycleDataService;

  @Post('/restore', { summary: '恢复数据' })
  async restore(@Body('ids') ids: number[]) {
    await this.recycleDataService.restore(ids);
    return this.ok();
  }
}
