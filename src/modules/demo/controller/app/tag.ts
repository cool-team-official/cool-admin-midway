import { Provide } from '@midwayjs/decorator';
import {
  CoolController,
  BaseController,
  CoolUrlTag,
  TagTypes,
} from '@cool-midway/core';

/**
 * 测试给URL打标签
 */
@Provide()
@CoolController({
  api: [],
  entity: '',
  pageQueryOp: () => {},
})
@CoolUrlTag({
  key: TagTypes.ignoreToken,
  value: [],
})
export class DemoAppTagController extends BaseController {}
