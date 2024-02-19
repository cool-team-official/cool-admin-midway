// 模式
export enum MODETYPE {
  // 本地
  LOCAL = 'local',
  // 云存储
  CLOUD = 'cloud',
  // 其他
  OTHER = 'other',
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
 * 文件上传
 */
export interface BaseUpload {
  /**
   * 获得上传模式
   */
  getMode(): Promise<Mode>;

  /**
   * 获得原始操作对象
   * @returns
   */
  getMetaFileObj(): Promise<any>;

  /**
   * 下载并上传
   * @param url
   * @param fileName 文件名
   */
  downAndUpload(url: string, fileName?: string): Promise<string>;

  /**
   * 指定Key(路径)上传，本地文件上传到存储服务
   * @param filePath 文件路径
   * @param key 路径一致会覆盖源文件
   */
  uploadWithKey(filePath, key): Promise<string>;

  /**
   * 上传文件
   * @param ctx
   * @param key 文件路径
   */
  upload(ctx): Promise<string>;
}
