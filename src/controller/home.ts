import { Get, Provide, Inject, Query, Post } from '@midwayjs/decorator';
import { CoolController, BaseController } from 'midwayjs-cool-core';
import { Role } from '../entity/role';

@Provide()
@CoolController({
  api: ['add','delete','update','info','list','page'],
  entity: 实体,
  pageQueryOp: {
    fieldEq: ['id', 'name'],
    keyWordLikeFields: ['a.name'],
    select: ['a.*, b.name AS roleName'],
    leftJoin: [
      {
        entity: Role,
        alias: 'b',
        condition: 'a.id = b.userId'
      }
    ]
  }
})
export class XxxController extends BaseController {
 
}
