import { App, Config, Inject, Middleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import { IMiddleware, IMidwayApplication } from '@midwayjs/core';
import { CryptoUtil } from '../../../comm/crypto';
import * as zlib from 'zlib';
import { promisify } from 'util';

const gzipAsync = promisify(zlib.gzip);
const gunzipAsync = promisify(zlib.gunzip);

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
            // 兼容新旧字段名：{encrypted|e, data|d, compressed|c}
            const isEncrypted = body?.['e'] === true || body?.['encrypted'] === true;
            const rawData = body?.['d'] ?? body?.['data'];
            const isCompressed = body?.['c'] === true || body?.['compressed'] === true;
            if (isEncrypted && rawData) {
              const decryptedText = await cryptoUtil.aesDecrypt(rawData, sessionKeyHex);
              if (isCompressed) {
                const compressedBuf = Buffer.from(decryptedText, 'base64');
                const decompressed = await gunzipAsync(compressedBuf);
                ctx.request.body = JSON.parse(decompressed.toString('utf8'));
              } else {
                ctx.request.body = JSON.parse(decryptedText);
              }
            }
          } catch (error) {
            ctx.logger.warn('请求体 AES 解密失败，将使用原始 body:', error.message);
          }
        }

        // 执行后续中间件/控制器
        await next();

        // 3. 响应阶段：gzip 压缩 → AES-GCM 加密 → JSON base64 传输
        try {
          const body = ctx.body;

          if (body) {
            const dataString =
              typeof body === 'string' ? body : JSON.stringify(body);

            // Step 1: gzip 压缩（二进制 Buffer）
            const compressed = await gzipAsync(Buffer.from(dataString, 'utf8'));

            // Step 2: AES-GCM 加密（二进制 Buffer）
            const encryptedBuffer = await cryptoUtil.aesEncryptBuffer(compressed, sessionKeyHex || undefined);

            // Step 3: JSON 包装（base64 字符串），避免 application/octet-stream 流的兼容问题
            const encryptedBase64 = encryptedBuffer.toString('base64');
            ctx.body = {
              e: true,
              c: true,
              d: encryptedBase64,
            };
            ctx.set('X-Response-Encrypted', 'true');
            ctx.set('X-Response-Compressed', 'gzip');
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
