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

import { IMiddleware, Middleware, Config } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import * as fs from 'fs';
import * as path from 'path';

/**
 * SPA History 模式回退中间件
 * 类似 connect-history-api-fallback，解决前端路由刷新 404 问题
 * 所有非 API、非静态资源的路径都返回 index.html，让 Vue Router 接管
 */
@Middleware()
export class SpaHistoryFallbackMiddleware
  implements IMiddleware<Context, NextFunction>
{
  @Config('koa.globalPrefix')
  prefix;

  // 需要忽略的路径（API、静态资源等）
  // 这些路径不返回 index.html，继续正常处理
  private ignorePatterns = [
    /^\/admin\//, // 后台 API（所有 /admin/ 开头的都是 API）
    /^\/app\//, // 移动端 API
    /^\/upload\//, // 上传文件
    /^\/static\//, // 静态资源
    /\.js$/, // JS 文件
    /\.css$/, // CSS 文件
    /\.png$/, // 图片
    /\.jpg$/, // 图片
    /\.gif$/, // 图片
    /\.ico$/, // favicon
    /\.svg$/, // SVG
    /\.woff/, // 字体
    /\.ttf$/, // 字体
    /\.eot$/, // 字体
    /\.json$/, // JSON 文件
    /\.m3u8$/, // 视频流
    /\.ts$/, // 视频分片（注意：不匹配 /video/videos 这种路由）
    /\.mp4$/, // 视频
    /\.apk$/, // APK
    /\.xlsx$/, // Excel
    /\.pdf$/, // PDF
    /\.html$/, // HTML 文件（直接访问的）
    /\.xml$/, // XML
    /\.txt$/, // 文本文件
    /\.zip$/, // ZIP
    /\.gz$/, // gzip 文件
  ];

  // 获取 SPA 入口 HTML 文件路径
  private getSpaIndexHtml(): string | null {
    // 尝试多种路径查找 index.html
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'dist', 'index.html'),
      path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'public',
        'dist',
        'index.html'
      ),
      path.join(__dirname, '..', '..', '..', 'public', 'dist', 'index.html'),
    ];

    for (const htmlPath of possiblePaths) {
      if (fs.existsSync(htmlPath)) {
        return htmlPath;
      }
    }
    return null;
  }

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 只处理 GET 和 HEAD 请求
      if (ctx.method !== 'GET' && ctx.method !== 'HEAD') {
        return await next();
      }

      let url = ctx.url.split('?')[0]; // 去除查询参数
      url = url.replace(this.prefix, '').split('?')[0]; // 去除 prefix

      // 检查是否应该忽略（API、静态资源等）
      for (const pattern of this.ignorePatterns) {
        if (pattern.test(url)) {
          return await next();
        }
      }

      // 所有非 API、非静态资源的路径，都返回 index.html（SPA 入口）
      // 这样 Vue Router 可以接管所有前端路由，如 /video/videos、/dist 等
      try {
        const htmlPath = this.getSpaIndexHtml();
        if (htmlPath) {
          ctx.set('Content-Type', 'text/html');
          ctx.body = fs.readFileSync(htmlPath, 'utf-8');
          return;
        }
      } catch (error) {
        // index.html 读取失败，记录错误后继续正常处理
        ctx.logger?.error('读取 SPA index.html 失败:', error);
      }

      // index.html 不存在或读取失败，继续正常处理
      return await next();
    };
  }
}
