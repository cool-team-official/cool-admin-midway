import { Body, Inject, Post, Provide } from '@midwayjs/decorator';
import {
  CoolController,
  BaseController,
  CoolUrlTag,
  TagTypes,
} from '@cool-midway/core';
import { DictInfoService } from '../../service/info';

/**
 * 字典信息
 */
@Provide()
@CoolController()
@CoolUrlTag({
  key: TagTypes.IGNORE_TOKEN,
  value: ['data'],
})
export class AppDictInfoController extends BaseController {
  @Inject()
  dictInfoService: DictInfoService;

  @Post('/data', { summary: '获得字典数据' })
  async data(@Body('types') types: string[] = []) {
    return this.ok(await this.dictInfoService.data(types));
  }
}
