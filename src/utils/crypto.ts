import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

/**
 * 加密工具类
 * 提供密码哈希、RSA非对称加密等功能
 * @author JustWe
 */
export class CryptoUtil {
  // bcrypt 盐值轮数
  private static readonly SALT_ROUNDS = 12;
  
  // RSA 密钥长度
  private static readonly RSA_KEY_SIZE = 2048;

  /**
   * 使用 bcrypt 对密码进行哈希
   * @param password 原始密码
   * @returns Promise<string> 哈希后的密码
   */
  static async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.SALT_ROUNDS);
    } catch (error) {
      throw new Error(`密码哈希失败: ${error.message}`);
    }
  }

  /**
   * 验证密码是否匹配
   * @param password 原始密码
   * @param hashedPassword 哈希后的密码
   * @returns Promise<boolean> 是否匹配
   */
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error(`密码验证失败: ${error.message}`);
    }
  }

  /**
   * 生成 RSA 密钥对
   * @returns 包含公钥和私钥的对象
   */
  static generateRSAKeyPair(): { publicKey: string; privateKey: string } {
    try {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: this.RSA_KEY_SIZE,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
      });

      return { publicKey, privateKey };
    } catch (error) {
      throw new Error(`RSA密钥对生成失败: ${error.message}`);
    }
  }

  /**
   * 使用公钥加密数据
   * @param data 要加密的数据
   * @param publicKey 公钥
   * @returns 加密后的数据（Base64编码）
   */
  static encryptWithPublicKey(data: string, publicKey: string): string {
    try {
      const buffer = Buffer.from(data, 'utf8');
      const encrypted = crypto.publicEncrypt(publicKey, buffer);
      return encrypted.toString('base64');
    } catch (error) {
      throw new Error(`公钥加密失败: ${error.message}`);
    }
  }

  /**
   * 使用私钥解密数据
   * @param encryptedData 加密的数据（Base64编码）
   * @param privateKey 私钥
   * @returns 解密后的原始数据
   */
  static decryptWithPrivateKey(encryptedData: string, privateKey: string): string {
    try {
      const buffer = Buffer.from(encryptedData, 'base64');
      const decrypted = crypto.privateDecrypt(privateKey, buffer);
      return decrypted.toString('utf8');
    } catch (error) {
      throw new Error(`私钥解密失败: ${error.message}`);
    }
  }

  /**
   * 生成随机盐值
   * @param length 盐值长度，默认32字节
   * @returns 随机盐值（十六进制字符串）
   */
  static generateSalt(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * 使用HMAC进行消息认证
   * @param data 要认证的数据
   * @param secret 密钥
   * @param algorithm 算法，默认sha256
   * @returns HMAC值（十六进制字符串）
   */
  static hmac(data: string, secret: string, algorithm: string = 'sha256'): string {
    try {
      return crypto.createHmac(algorithm, secret).update(data).digest('hex');
    } catch (error) {
      throw new Error(`HMAC计算失败: ${error.message}`);
    }
  }

  /**
   * 检查密码是否为MD5格式（32位十六进制字符串）
   * @param password 密码字符串
   * @returns 是否为MD5格式
   */
  static isMD5Hash(password: string): boolean {
    return /^[a-f0-9]{32}$/i.test(password);
  }

  /**
   * 检查密码是否为bcrypt格式
   * @param password 密码字符串
   * @returns 是否为bcrypt格式
   */
  static isBcryptHash(password: string): boolean {
    return /^\$2[aby]?\$\d{1,2}\$[./A-Za-z0-9]{53}$/.test(password);
  }
}
