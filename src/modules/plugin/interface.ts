/**
 * 插件信息
 */
export interface PluginInfo {
  /** 名称 */
  name?: string;
  /** 唯一标识 */
  key?: string;
  /** 钩子 */
  hook?: string;
  /** 是否单例 */
  singleton?: boolean;
  /** 版本 */
  version?: string;
  /** 描述 */
  description?: string;
  /** 作者 */
  author?: string;
  /** logo */
  logo?: string;
  /** README 使用说明 */
  readme?: string;
  /** 配置 */
  config?: any;
}
