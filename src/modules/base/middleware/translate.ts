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

import { Config, ILogger, Middleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import { IMiddleware, Inject } from '@midwayjs/core';
import { BaseTranslateService } from '../service/translate';
import * as _ from 'lodash';
import { RESCODE } from '@cool-midway/core';
/**
 * 翻译中间件
 */
@Middleware()
export class BaseTranslateMiddleware
  implements IMiddleware<Context, NextFunction>
{
  @Inject()
  baseTranslateService: BaseTranslateService;

  @Inject()
  logger: ILogger;

  @Config('cool.i18n')
  config: {
    /** 是否开启 */
    enable: boolean;
    /** 语言 */
    languages: string[];
    /** 翻译服务 */
    serviceUrl?: string;
  };

  resolve() {
    return async (ctx, next: NextFunction) => {
      const url = ctx.url;
      const language = ctx.get('language');
      let data;
      try {
        data = await next();
      } catch (error) {
        this.logger.error(error);
        // 处理翻译消息
        if (error.name == 'CoolCommException') {
          if (error.message && error.message !== 'success') {
            ctx.status = error.statusCode || 200;
            ctx.body = {
              code: RESCODE.COMMFAIL,
              message: await this.baseTranslateService.translate(
                'msg',
                language,
                error.message
              ),
            };
            return;
          }
        }
        ctx.status = 200;
        ctx.body = {
          code: RESCODE.COMMFAIL,
          message: error.message,
        };
        return;
      }
      if (!this.config.enable) {
        return;
      }
      // 处理菜单翻译
      if (url == '/admin/base/comm/permmenu') {
        for (const menu of data.data.menus) {
          if (menu.name) {
            menu.name = await this.baseTranslateService.translate(
              'menu',
              language,
              menu.name
            );
          }
        }
      }
      if (url == '/admin/base/sys/menu/list') {
        for (const menu of data.data) {
          if (menu.name) {
            menu.name = await this.baseTranslateService.translate(
              'menu',
              language,
              menu.name
            );
          }
        }
      }
      // 处理字典翻译
      if (url == '/admin/dict/info/list') {
        for (const dict of data.data) {
          dict.name = await this.baseTranslateService.translate(
            'dict:info',
            language,
            dict.name
          );
        }
      }
      if (url == '/admin/dict/type/page') {
        for (const dict of data.data.list) {
          dict.name = await this.baseTranslateService.translate(
            'dict:type',
            language,
            dict.name
          );
        }
      }
      if (url == '/admin/dict/info/data' || url == '/app/dict/info/data') {
        for (const key in data.data) {
          for (const item of data.data[key]) {
            item.name = await this.baseTranslateService.translate(
              'dict:info',
              language,
              item.name
            );
          }
        }
      }
    };
  }
}
