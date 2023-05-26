export interface CoolSmsConfig {
  /**
   * 阿里云短信配置
   */
  ali: CoolSmsAliConfig;
  /**
   * 腾讯云短信配置
   */
  tx: CoolTxConfig;
  /**
   * 云片短信配置
   */
  yp: CoolYpConfig;
}

/**
 * 阿里云配置
 */
export interface CoolSmsAliConfig {
  /**
   * 阿里云accessKeyId
   */
  accessKeyId: string;
  /**
   * 阿里云accessKeySecret
   */
  accessKeySecret: string;
  /**
   * 签名，非必填，调用时可以传入
   */
  signName?: string;
  /**
   * 模板，非必填，调用时可以传入
   */
  template?: string;
}

/**
 * 腾讯云配置
 */
export interface CoolTxConfig {
  /**
   * 应用ID
   */
  appId: string;
  /**
   * 腾讯云secretId
   */
  secretId: string;
  /**
   * 腾讯云secretKey
   */
  secretKey: string;
  /**
   * 签名，非必填，调用时可以传入
   */
  signName?: string;
  /**
   * 模板，非必填，调用时可以传入
   */
  template?: string;
}

/**
 * 云片短信配置
 */
export interface CoolYpConfig {
  /**
   * 云片apikey
   */
  apikey: string;
  /**
   * 签名，非必填，调用时可以传入
   */
  signName?: string;
  /**
   * 模板，非必填，调用时可以传入
   */
  template?: string;
}
