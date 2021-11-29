import { Application } from 'egg';
import { ModuleConfig } from '@cool-midway/core';

/**
 * 模块的配置
 */
export default (app: Application) => {
  return {
    // 模块名称
    name: '文件空间',
    // 模块描述
    description: '上传和管理文件资源',
    // 中间件
    middlewares: [],
  } as ModuleConfig;
};
