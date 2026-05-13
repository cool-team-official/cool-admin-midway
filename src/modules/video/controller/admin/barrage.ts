import {
  BaseController,
  CoolController,
  CoolUrlTag,
  TagTypes,
} from '@cool-midway/core';
import { BarrageEntity } from '../../entity/barrage';

/**
 *
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: BarrageEntity,
  insertParam: ctx => {
    return {
      // 获得当前登录的后台用户ID，需要请求头传Authorization参数
      createUserId: ctx.admin.userId,
    };
  },
  pageQueryOp: {
    fieldEq: ['type', 'video_id', 'status', 'sort'],
    keyWordLikeFields: ['text'],
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
          'time >= :startTime AND time <= :endTime',
          { startTime, endTime },
        ]);
      }

      return where;
    },
  },
  listQueryOp: {
    fieldEq: ['type', 'video_id'],
  },
})
@CoolUrlTag({
  key: TagTypes.IGNORE_TOKEN,
  value: ['page', 'info', 'add'],
})
export class AdminBarrageController extends BaseController {}
