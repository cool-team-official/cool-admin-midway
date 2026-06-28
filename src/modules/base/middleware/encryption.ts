import { App, Config, Inject, Middleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import { IMiddleware, IMidwayApplication } from '@midwayjs/core';
import { CryptoUtil } from '../../../comm/crypto';

/**
 * 响应数据加密中间件
 * 用于对 /app/xx 路径的响应数据进行加密
 * 支持 RSA + 一次性 AES 会话密钥方案：
 * - 客户端通过 X-Session-Key 请求头发送 RSA 加密的 AES 密钥
 * - 服务端用 RSA 私钥解密得到 AES 会话密钥
 * - 使用该会话密钥解密请求体、加密响应体
 */
@Middleware()
export class BaseEncryptionMiddleware
  implements IMiddleware<Context, NextFunction>
{
  @Config('koa.globalPrefix')
  prefix;

  @App()
  app: IMidwayApplication;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      let { url } = ctx;
      url = url.replace(this.prefix, '').split('?')[0];

      if (url.startsWith('/app/')) {
        const cryptoUtil = await ctx.requestContext.getAsync(CryptoUtil);
        let sessionKeyHex: string | null = null;

        // 1. 请求阶段：解析 X-Session-Key，解密得到 AES 会话密钥
        const encryptedSessionKey = ctx.get('X-Session-Key');
        if (encryptedSessionKey) {
          try {
            sessionKeyHex = await cryptoUtil.rsaDecrypt(encryptedSessionKey);
          } catch (error) {
            ctx.logger.warn('X-Session-Key RSA 解密失败，将使用默认密钥:', error.message);
          }
        }

        // 2. 请求阶段：解密请求体（POST/PUT/PATCH 的加密 body）
        if (sessionKeyHex && ['POST', 'PUT', 'PATCH'].includes(ctx.method.toUpperCase())) {
          try {
            const body = ctx.request.body;
            if (body && body['encrypted'] === true && body['data']) {
              const decryptedText = await cryptoUtil.aesDecrypt(body['data'], sessionKeyHex);
              ctx.request.body = JSON.parse(decryptedText);
            }
          } catch (error) {
            ctx.logger.warn('请求体 AES 解密失败，将使用原始 body:', error.message);
          }
        }

        // 执行后续中间件/控制器
        await next();

        // 3. 响应阶段：用 AES 会话密钥加密响应体
        try {
          const body = ctx.body;

          if (body) {
            const dataString =
              typeof body === 'string' ? body : JSON.stringify(body);

            const keyToUse = sessionKeyHex;
            const encryptedData = await cryptoUtil.aesEncrypt(dataString, keyToUse);

            ctx.body = {
              encrypted: true,
              data: encryptedData,
            };

            ctx.set('X-Response-Encrypted', 'true');
          }
        } catch (error) {
          ctx.logger.error('响应数据加密失败:', error);
        }
      } else {
        await next();
      }
    };
  }
}