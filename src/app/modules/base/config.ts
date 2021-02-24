import { Application } from "egg";
import { ModuleConfig } from 'midwayjs-cool-core';

/**
 * 模块的配置
 */
export default (app: Application) => {
    return {
        // 模块名称
        name: '权限管理',
        // 模块描述
        describe: '基础的权限管理功能，包括登录，权限校验',
        // 中间件
        middlewares: ['baseLogsMiddleware'],
    } as ModuleConfig;
};
