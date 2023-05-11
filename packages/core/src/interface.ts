import { MiddlewareParamArray } from "@midwayjs/core";
import { AedesOptions } from "aedes";
import { PublishPacket } from "packet";

/**
 * 模块配置
 */
export interface ModuleConfig {
  /** 名称 */
  name: string;
  /** 描述 */
  description: string;
  /** 模块中间件 */
  middlewares?: MiddlewareParamArray;
  /** 全局中间件 */
  globalMiddlewares?: MiddlewareParamArray;
  /** 模块加载顺序，默认为0，值越大越优先加载 */
  order?: number;
}

export interface CoolConfig {
  /** 是否自动导入数据库 */
  initDB?: boolean;
  // 实体配置
  //   entity?: {
  //     primaryType: "uuid" | "increment" | "rowid" | "identity";
  //   };
  /** crud配置 */
  crud?: {
    /** 软删除 */
    softDelete: boolean;
    /** 分页查询每页条数 */
    pageSize: number;
    // 多租户
    // tenant: boolean;
  };
  /** elasticsearch配置 */
  es?: {
    nodes: string[];
  };
  /** pay */
  pay?: {
    /** 微信支付 */
    wx?: CoolWxPayConfig;
    /** 支付宝支付 */
    ali?: CoolAliPayConfig;
  };
  /** rpc */
  rpc?: CoolRpcConfig;
  /** redis  */
  redis?: RedisConfig | RedisConfig[];
  /** 文件上传 */
  file?: {
    /** 上传模式 */
    mode: MODETYPE;
    /** 本地上传 文件地址前缀 */
    domain?: string;
    /** oss */
    oss?: OSSConfig;
    /** cos */
    cos?: COSConfig;
    /** qiniu */
    qiniu?: QINIUConfig;
  };
  /** IOT 配置 */
  iot?: CoolIotConfig;
}

export interface CoolRpcConfig {
  /** 服务名称 */
  name: string;
  /** redis */
  redis: RedisConfig & RedisConfig[] & unknown;
}

export interface RedisConfig {
  /** host */
  host: string;
  /** password */
  password: string;
  /** port */
  port: number;
  /** db */
  db: number;
}

// 模式
export enum MODETYPE {
  /** 本地 */
  LOCAL = "local",
  /** 云存储 */
  CLOUD = "cloud",
  /** 其他 */
  OTHER = "other",
}

export enum CLOUDTYPE {
  /** 阿里云存储 */
  OSS = "oss",
  /** 腾讯云存储 */
  COS = "cos",
  /** 七牛云存储 */
  QINIU = "qiniu",
}

/**
 * 上传模式
 */
export interface Mode {
  /** 模式 */
  mode: MODETYPE;
  /** 类型 */
  type: string;
}

/**
 * 模块配置
 */
export interface CoolFileConfig {
  /** 上传模式 */
  mode: MODETYPE;
  /** 阿里云oss 配置 */
  oss: OSSConfig;
  /** 腾讯云 cos配置 */
  cos: COSConfig;
  /** 七牛云 配置 */
  qiniu: QINIUConfig;
  /** 文件前缀 */
  domain: string;
}

/**
 * OSS 配置
 */
export interface OSSConfig {
  /** 阿里云accessKeyId */
  accessKeyId: string;
  /** 阿里云accessKeySecret */
  accessKeySecret: string;
  /** 阿里云oss的bucket */
  bucket: string;
  /** 阿里云oss的endpoint */
  endpoint: string;
  /** 阿里云oss的timeout */
  timeout: string;
  /** 签名失效时间，毫秒 */
  expAfter?: number;
  /** 文件最大的 size */
  maxSize?: number;
  // host
  host?: string;
}

/**
 * COS 配置
 */
export interface COSConfig {
  /** 腾讯云accessKeyId */
  accessKeyId: string;
  /** 腾讯云accessKeySecret */
  accessKeySecret: string;
  /** 腾讯云cos的bucket */
  bucket: string;
  /** 腾讯云cos的区域 */
  region: string;
  /** 腾讯云cos的公网访问地址 */
  publicDomain: string;
  /** 上传持续时间 */
  durationSeconds?: number;
  /** 允许操作（上传）的对象前缀 */
  allowPrefix?: string;
  /** 密钥的权限列表 */
  allowActions?: string[];
}

export interface QINIUConfig {
  /** 七牛云accessKeyId */
  accessKeyId: string;
  /** 七牛云accessKeySecret */
  accessKeySecret: string;
  /** 七牛云cos的bucket */
  bucket: string;
  /** 七牛云cos的区域 */
  region: string;
  /** 七牛云cos的公网访问地址 */
  publicDomain: string;
  /** 上传地址 */
  uploadUrl?: string;
  /** 上传fileKey */
  fileKey?: string;
}

/**
 * 微信支付配置
 */
export interface CoolWxPayConfig {
  /** 直连商户申请的公众号或移动应用appid。 */
  appid: string;
  /** 商户号 */
  mchid: string;
  /** 可选参数 证书序列号 */
  serial_no?: string;
  /** 回调链接 */
  notify_url: string;
  /** 公钥 */
  publicKey: Buffer;
  /** 私钥 */
  privateKey: Buffer;
  /** 可选参数 认证类型，目前为WECHATPAY2-SHA256-RSA2048 */
  authType?: string;
  /** 可选参数 User-Agent */
  userAgent?: string;
  /** 可选参数 APIv3密钥 */
  key?: string;
}

/**
 * 支付宝支付配置
 */
export interface CoolAliPayConfig {
  /** 支付回调地址 */
  notifyUrl: string;
  /** 应用ID */
  appId: string;
  /**
   * 应用私钥字符串
   * RSA签名验签工具：https://docs.open.alipay.com/291/106097）
   * 密钥格式一栏请选择 “PKCS1(非JAVA适用)”
   */
  privateKey: string;
  /** 签名类型 */
  signType?: "RSA2" | "RSA";
  /** 支付宝公钥（需要对返回值做验签时候必填） */
  alipayPublicKey?: string;
  /** 网关 */
  gateway?: string;
  /** 网关超时时间（单位毫秒，默认 5s） */
  timeout?: number;
  /** 是否把网关返回的下划线 key 转换为驼峰写法 */
  camelcase?: boolean;
  /** 编码（只支持 utf-8） */
  charset?: "utf-8";
  /** api版本 */
  version?: "1.0";
  urllib?: any;
  /** 指定private key类型, 默认： PKCS1, PKCS8: PRIVATE KEY, PKCS1: RSA PRIVATE KEY */
  keyType?: "PKCS1" | "PKCS8";
  /** 应用公钥证书文件路径 */
  appCertPath?: string;
  /** 应用公钥证书文件内容 */
  appCertContent?: string | Buffer;
  /** 应用公钥证书sn */
  appCertSn?: string;
  /** 支付宝根证书文件路径 */
  alipayRootCertPath?: string;
  /** 支付宝根证书文件内容 */
  alipayRootCertContent?: string | Buffer;
  /** 支付宝根证书sn */
  alipayRootCertSn?: string;
  /** 支付宝公钥证书文件路径 */
  alipayPublicCertPath?: string;
  /** 支付宝公钥证书文件内容 */
  alipayPublicCertContent?: string | Buffer;
  /** 支付宝公钥证书sn */
  alipayCertSn?: string;
  /** AES密钥，调用AES加解密相关接口时需要 */
  encryptKey?: string;
  /** 服务器地址 */
  wsServiceUrl?: string;
}

/**
 * IOT配置
 */
export interface CoolIotConfig {
  /** MQTT服务端口 */
  port: number;
  /** MQTT Websocket服务端口 */
  wsPort: number;
  /** redis 配置 mqtt cluster下必须要配置 */
  redis?: {
    /** host */
    host: string;
    /** port */
    port: number;
    /** password */
    password: string;
    /** db */
    db: number;
  };
  /** 发布消息配置 */
  publish?: PublishPacket;
  /** 认证 */
  auth?: {
    /** 用户 */
    username: string;
    /** 密码 */
    password: string;
  };
  /** 服务配置 */
  serve?: AedesOptions;
}
