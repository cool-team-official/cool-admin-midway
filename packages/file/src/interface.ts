// 模式
export enum MODETYPE {
  // 本地
  LOCAL = 'local',
  // 云存储
  CLOUD = 'cloud',
  // 其他
  OTHER = 'other',
}

export enum CLOUDTYPE {
  // 阿里云存储
  OSS = 'oss',
  // 腾讯云存储
  COS = 'cos',
  // 七牛云存储
  QINIU = 'qiniu',
}

/**
 * 上传模式
 */
export interface Mode {
  // 模式
  mode: MODETYPE;
  // 类型
  type: string;
}

/**
 * 模块配置
 */
export interface CoolFileConfig {
  // 上传模式
  mode: MODETYPE;
  // 阿里云oss 配置
  oss: OSSConfig;
  // 腾讯云 cos配置
  cos: COSConfig;
  // 七牛云 配置
  qiniu: QINIUConfig;
  // 文件前缀
  domain: string;
}

/**
 * OSS 配置
 */
export interface OSSConfig {
  // 阿里云accessKeyId
  accessKeyId: string;
  // 阿里云accessKeySecret
  accessKeySecret: string;
  // 阿里云oss的bucket
  bucket: string;
  // 阿里云oss的endpoint
  endpoint: string;
  // 阿里云oss的timeout
  timeout: string;
  // 签名失效时间，毫秒
  expAfter?: number;
  // 文件最大的 size
  maxSize?: number;
}

/**
 * COS 配置
 */
export interface COSConfig {
  // 腾讯云accessKeyId
  accessKeyId: string;
  // 腾讯云accessKeySecret
  accessKeySecret: string;
  // 腾讯云cos的bucket
  bucket: string;
  // 腾讯云cos的区域
  region: string;
  // 腾讯云cos的公网访问地址
  publicDomain: string;
  // 上传持续时间
  durationSeconds?: number;
  // 允许操作（上传）的对象前缀
  allowPrefix?: string;
  // 密钥的权限列表
  allowActions?: string[];
}

export interface QINIUConfig {
  // 七牛云accessKeyId
  accessKeyId: string;
  // 七牛云accessKeySecret
  accessKeySecret: string;
  // 七牛云cos的bucket
  bucket: string;
  // 七牛云cos的区域
  region: string;
  // 七牛云cos的公网访问地址
  publicDomain: string;
  // 上传地址
  uploadUrl?: string;
  // 上传fileKey
  fileKey?: string;
}
