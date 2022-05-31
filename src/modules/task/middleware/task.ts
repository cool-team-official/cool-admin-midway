import { CoolCommException } from '@cool-midway/core';
import { Inject, Middleware } from '@midwayjs/decorator';
import { NextFunction, Context } from '@midwayjs/koa';
import { IMiddleware } from '@midwayjs/core';
import { TaskInfoQueue } from '../queue/task';

/**
 * 任务中间件
 */
@Middleware()
export class TaskMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  taskInfoQueue: TaskInfoQueue;
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const urls = ctx.url.split('/');
      if (
        ['add', 'update', 'once', 'stop', 'start'].includes(
          urls[urls.length - 1]
        )
      ) {
        if (!this.taskInfoQueue.metaQueue) {
          throw new CoolCommException(
            'task插件未启用或redis配置错误或redis版本过低(>=6.x)'
          );
        }
      }
      await next();
    };
  }
}
