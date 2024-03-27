import {
  CoolController,
  BaseController,
  CoolUrlTag,
  TagTypes,
  CoolTag,
} from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { UserWxService } from '../../service/wx';

/**
 * 通用
 */
@CoolUrlTag()
@CoolController()
export class UserCommController extends BaseController {
  @Inject()
  userWxService: UserWxService;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/wxMpConfig', { summary: '获取微信公众号配置' })
  public async getWxMpConfig(@Body('url') url: string) {
    return this.ok(await this.userWxService.getWxMpConfig(url));
  }
}
