import { Get, Inject, Provide } from '@midwayjs/decorator';
import {
  CoolController,
  BaseController,
  CoolUrlTag,
  TagTypes,
  CoolUrlTagData,
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
  key: TagTypes.IGNORE_TOKEN,
  value: ['add'],
})
export class DemoAppTagController extends BaseController {
  @Inject()
  tag: CoolUrlTagData;

  /**
   * 获得标签数据， 如可以标记忽略token的url，然后在中间件判断
   * @returns
   */
  @Get('/data')
  async data() {
    return this.ok(this.tag.byKey(TagTypes.IGNORE_TOKEN));
  }
}
