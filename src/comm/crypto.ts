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

// src/utils/crypto.util.ts
import { Config, ILogger, Inject, Provide } from '@midwayjs/core';
import * as crypto from 'crypto';

@Provide()
export class CryptoUtil {
  @Inject()
  logger: ILogger;
  @Config('cryptoConfig')
  cryptoConfig: {
    aesKey?: string;
    rsaPrivateKey?: string;
    rsaPublicKey?: string;
    defaultSalt: string;
  };

  async aesEncrypt(text: string, key?: string): Promise<string> {
    const keyBuffer = Buffer.from(key || this.cryptoConfig.aesKey, 'hex');
    const iv = crypto.randomBytes(16);
    const cryptoKey = await crypto.webcrypto.subtle.importKey(
      'raw', keyBuffer, { name: 'AES-GCM' }, false, ['encrypt']
    );
    const encoded = new TextEncoder().encode(text);
    const encrypted = await crypto.webcrypto.subtle.encrypt(
      { name: 'AES-GCM', iv }, cryptoKey, encoded
    );
    const buf = Buffer.from(encrypted);
    return Buffer.concat([iv, buf.slice(0, -16), buf.slice(-16)]).toString('base64');
  }

  async aesDecrypt(encryptedText: string, key?: string): Promise<string> {
    const keyBuffer = Buffer.from(key || this.cryptoConfig.aesKey, 'hex');
    const buffer = Buffer.from(encryptedText, 'base64');
    const iv = buffer.slice(0, 16);
    const authTag = buffer.slice(-16);
    const ciphertext = buffer.slice(16, -16);
    const cryptoKey = await crypto.webcrypto.subtle.importKey(
      'raw', keyBuffer, { name: 'AES-GCM' }, false, ['decrypt']
    );
    const decrypted = await crypto.webcrypto.subtle.decrypt(
      { name: 'AES-GCM', iv }, cryptoKey, Buffer.concat([ciphertext, authTag])
    );
    return new TextDecoder().decode(decrypted);
  }

  async aesEncryptBuffer(data: Buffer, key?: string): Promise<Buffer> {
    const keyBuffer = Buffer.from(key || this.cryptoConfig.aesKey, 'hex');
    // 使用 16 字节 IV，与客户端 pointycastle GCMBlockCipher 一致
    const iv = crypto.randomBytes(16);
    const cryptoKey = await crypto.webcrypto.subtle.importKey(
      'raw', keyBuffer, { name: 'AES-GCM' }, false, ['encrypt']
    );
    const encrypted = await crypto.webcrypto.subtle.encrypt(
      { name: 'AES-GCM', iv }, cryptoKey, data
    );
    const buf = Buffer.from(encrypted);
    return Buffer.concat([iv, buf.slice(0, -16), buf.slice(-16)]);
  }

  async aesDecryptBuffer(encryptedBuffer: Buffer, key?: string): Promise<Buffer> {
    const keyBuffer = Buffer.from(key || this.cryptoConfig.aesKey, 'hex');
    // 16 字节 IV，与客户端一致
    const iv = encryptedBuffer.slice(0, 16);
    const authTag = encryptedBuffer.slice(-16);
    const ciphertext = encryptedBuffer.slice(16, -16);
    const cryptoKey = await crypto.webcrypto.subtle.importKey(
      'raw', keyBuffer, { name: 'AES-GCM' }, false, ['decrypt']
    );
    const decrypted = await crypto.webcrypto.subtle.decrypt(
      { name: 'AES-GCM', iv }, cryptoKey, Buffer.concat([ciphertext, authTag])
    );
    return Buffer.from(decrypted);
  }

  // RSA 非对称加密
  // ---------------------------------------------------------------------------
  // AES-256-GCM 原始字节加解密（无 Base64 编码，为二进制传输铺路）
  // ---------------------------------------------------------------------------

  /**
   * AES-256-GCM 加密原始字节，返回 raw(iv + ciphertext + authTag)
   * 与 aesEncrypt 的区别：输入/输出均为 Buffer，跳过中间的 utf8/base64 转换
   */
  async aesEncryptRaw(data: Buffer, key?: string): Promise<Buffer> {
    const keyBuffer = Buffer.from(key || this.cryptoConfig.aesKey, 'hex');
    const iv = crypto.randomBytes(16);
    const cryptoKey = await crypto.webcrypto.subtle.importKey(
      'raw', keyBuffer, { name: 'AES-GCM' }, false, ['encrypt']
    );
    const encrypted = await crypto.webcrypto.subtle.encrypt(
      { name: 'AES-GCM', iv }, cryptoKey, data
    );
    const buf = Buffer.from(encrypted);
    return Buffer.concat([iv, buf.slice(0, -16), buf.slice(-16)]);
  }

  /**
   * AES-256-GCM 同步解密原始字节，输入 raw(iv + ciphertext + authTag)，输出原始明文
   * 与 aesDecrypt 的区别：输入/输出均为 Buffer，跳过中间的 base64/utf8 转换
   */
  async aesDecryptRaw(encryptedData: Buffer, key?: string): Promise<Buffer> {
    const keyBuffer = Buffer.from(key || this.cryptoConfig.aesKey, 'hex');
    const iv = encryptedData.slice(0, 16);
    const authTag = encryptedData.slice(-16);
    const ciphertext = encryptedData.slice(16, -16);
    const cryptoKey = await crypto.webcrypto.subtle.importKey(
      'raw', keyBuffer, { name: 'AES-GCM' }, false, ['decrypt']
    );
    const decrypted = await crypto.webcrypto.subtle.decrypt(
      { name: 'AES-GCM', iv }, cryptoKey, Buffer.concat([ciphertext, authTag])
    );
    return Buffer.from(decrypted);
  }

  // ---------------------------------------------------------------------------
  // RSA 非对称加密
  // ---------------------------------------------------------------------------

  async rsaEncrypt(text: string): Promise<string> {
    return crypto
      .publicEncrypt(
        {
          key: this.cryptoConfig.rsaPublicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        Buffer.from(text)
      )
      .toString('base64');
  }

  // RSA 非对称解密
  async rsaDecrypt(encryptedText: string): Promise<string> {
    return crypto
      .privateDecrypt(
        {
          key: this.cryptoConfig.rsaPrivateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        Buffer.from(encryptedText, 'base64')
      )
      .toString('utf8');
  }

  // SHA256 哈希加盐
  async sha256(text: string, salt?: string): Promise<string> {
    const hash = crypto.createHash('sha256');
    hash.update(text + (salt || this.cryptoConfig.defaultSalt));
    return hash.digest('hex');
  }

  // 生成随机盐值
  generateSalt(length = 16): string {
    return crypto.randomBytes(length).toString('hex');
  }
}
