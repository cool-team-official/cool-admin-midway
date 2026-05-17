import {
  BaseController,
  CoolController,
  CoolTag,
  CoolUrlTag,
  TagTypes,
} from '@cool-midway/core';
import { BarrageEntity } from '../../entity/barrage';
import { Get } from '@midwayjs/core';
import { UserInfoEntity } from '../../../user/entity/info';

/**
 *
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: BarrageEntity,
  insertParam: ctx => {
    return {
      // 获得当前登录的后台用户ID，需要请求头传Authorization参数
      createUserId: ctx.user.id,
    };
  },
  pageQueryOp: {
    fieldEq: [
      { column: 'a.type', requestParam: 'type' },
      { column: 'a.video_id', requestParam: 'video_id' },
      { column: 'a.status', requestParam: 'status' },
      { column: 'a.sort', requestParam: 'sort' },
    ],
    keyWordLikeFields: ['a.text'],
    select: ['a.*', 'b.avatarUrl', 'b.nickName', 'b.phone', 'b.gender'],
    join: [
      {
        entity: UserInfoEntity,
        alias: 'b',
        condition: 'a.createUserId = b.id',
        type: 'innerJoin',
      },
    ],
    where: ctx => {
      let { startTime, endTime } = ctx.request.body;
      const where = [];

      if (startTime && !endTime) {
        endTime = startTime + 5000;
      }
      if (!startTime && endTime) {
        startTime = endTime - 5000;
      }

      if (startTime && endTime) {
        where.push([
          'a.time >= :startTime AND a.time <= :endTime',
          { startTime, endTime },
        ]);
      }

      return where;
    },
    addOrderBy: {
      createTime: 'DESC',
    },
  },
  listQueryOp: {
    fieldEq: ['type', 'video_id'],
  },
})
@CoolUrlTag({
  key: TagTypes.IGNORE_TOKEN,
  value: ['page', 'info', 'list'],
})
export class AppBarrageController extends BaseController {
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/other')
  async other() {
    return this.ok('hello, cool-admin!!!');
  }
}
