/*
 Copyright © 2024-2026 Juzi Video. All rights reserved.
 版权所有 © 2024-2026 橘子视频。保留所有权利。
 作者：xiaoliwanshui
 邮箱：chocolaer@126.com


 ============================================================================
                                版权声明
 ============================================================================


 本软件（以下简称"本软件"）受中华人民共和国著作权法及国际著作权条约保护。


 【版权人】橘子视频 (Juzi Video)
 【权利范围】本软件的全部源代码、二进制文件、文档及相关材料


 ============================================================================
                                许可证协议
 ============================================================================


 本软件仅授权用户进行以下操作：


  ✓ 可免费试用：下载并运行本软件，仅限个人非商业用途
  ✓ 可学习研究：查看和学习本软件源代码，仅供个人研究


 ============================================================================
                                禁止事项
 ============================================================================


  ✗ 禁止商业使用：未经授权，不得对本软件进行销售、授权、出租或商业利用
  ✗ 禁止修改演绎：未经授权，不得对本软件进行修改、反向工程或创作衍生作品
  ✗ 禁止分发传播：未经授权，不得以任何形式向第三方分发或公开本软件
  ✗ 禁止删除版权：不得移除或篡改本软件中的任何版权声明或知识产权标识


 ============================================================================
                                免责声明
 ============================================================================


 本软件按"原样"提供，不提供任何明示或暗示的保证，包括但不限于：
 对适销性、特定用途适用性、非侵权性的保证。在任何情况下，
 版权持有人均不对因使用本软件而产生的任何索赔、损害或损失承担责任。


 ============================================================================
                                终止条款
 ============================================================================


 若您违反本协议的任何条款，本许可证将自动终止。
 终止后，您必须立即停止使用本软件，并销毁所有相关副本。


 ============================================================================
                                法律适用
 ============================================================================


 本协议受中华人民共和国法律管辖，并按其解释。


 ============================================================================
                                联系我们
 ============================================================================


 如需商业授权或其他合作事宜，请联系版权方。


 ---


 本软件受著作权法和国际条约保护。
 未经授权的复制、修改、分发或商业使用将被追究法律责任。
*/

import { BaseController, CoolController, CoolTag, CoolUrlTag, TagTypes } from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { UserLoginService } from '../../service/login';
import { BaseSysLoginService } from '../../../base/service/sys/login';

/**
 * 登录
 */
@CoolUrlTag()
@CoolController()
export class AppUserLoginController extends BaseController {
  @Inject()
  userLoginService: UserLoginService;

  @Inject()
  baseSysLoginService: BaseSysLoginService;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/mini', { summary: '小程序登录' })
  async mini(@Body() body) {
    const { code, encryptedData, iv } = body;
    return this.ok(await this.userLoginService.mini(code, encryptedData, iv));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/mp', { summary: '公众号登录' })
  async mp(@Body('code') code: string) {
    return this.ok(await this.userLoginService.mp(code));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/wxApp', { summary: '微信APP授权登录' })
  async app(@Body('code') code: string) {
    return this.ok(await this.userLoginService.wxApp(code));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/phone', { summary: '手机号登录' })
  async phone(@Body('phone') phone: string, @Body('smsCode') smsCode: string) {
    return this.ok(await this.userLoginService.phoneVerifyCode(phone, smsCode));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/uniPhone', { summary: '一键手机号登录' })
  async uniPhone(
    @Body('access_token') access_token: string,
    @Body('openid') openid: string,
    @Body('appId') appId: string
  ) {
    return this.ok(
      await this.userLoginService.uniPhone(access_token, openid, appId)
    );
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/miniPhone', { summary: '绑定小程序手机号' })
  async miniPhone(@Body() body) {
    const { code, encryptedData, iv } = body;
    return this.ok(
      await this.userLoginService.miniPhone(code, encryptedData, iv)
    );
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/captcha', { summary: '图片验证码' })
  async captcha(
    @Query('width') width: number,
    @Query('height') height: number,
    @Query('color') color: string
  ) {
    return this.ok(
      await this.baseSysLoginService.captcha(width, height, color)
    );
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/smsCode', { summary: '验证码' })
  async smsCode(
    @Body('phone') phone: string,
    @Body('captchaId') captchaId: string,
    @Body('code') code: string
  ) {
    return this.ok(await this.userLoginService.smsCode(phone, captchaId, code));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/refreshToken', { summary: '刷新token' })
  public async refreshToken(@Body('refreshToken') refreshToken) {
    return this.ok(await this.userLoginService.refreshToken(refreshToken));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/password', { summary: '密码登录' })
  async password(
    @Body('phone') phone: string,
    @Body('password') password: string
  ) {
    return this.ok(await this.userLoginService.password(phone, password));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/app_login', { summary: '验证码' })
  async AppLogin(
    @Body('phone') phone: string,
    @Body('password') password: string,
    @Body('captchaId') captchaId: string,
    @Body('code') code: string,
    @Body('inviteCode') inviteCode?: string
  ) {
    return this.ok(await this.userLoginService.appLogin(phone, password, code, captchaId, inviteCode));
  }
}
