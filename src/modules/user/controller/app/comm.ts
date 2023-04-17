import {
  CoolController,
  BaseController,
  CoolUrlTag,
  TagTypes,
} from '@cool-midway/core';
import { Get, Inject, Query } from '@midwayjs/core';
import { UserWxService } from '../../service/wx';

/**
 * 通用
 */
@CoolUrlTag({
  key: TagTypes.IGNORE_TOKEN,
  value: ['wxMpConfig'],
})
@CoolController()
export class UserCommController extends BaseController {
  @Inject()
  userWxService: UserWxService;

  @Get('/wxMpConfig', { summary: '获取微信公众号配置' })
  public async getWxMpConfig(@Query() url: string) {
    const a = await this.userWxService.getWxMpConfig(url);
    return this.ok(a);
  }
}
