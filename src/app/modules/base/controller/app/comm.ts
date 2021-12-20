import { Provide, Inject, Get, Post } from '@midwayjs/decorator';
import {
  CoolController,
  BaseController,
  ICoolCache,
  ICoolFile,
} from '@cool-midway/core';
import { Context } from 'egg';

/**
 * 不需要登录的后台接口
 */
@Provide()
@CoolController()
export class BaseAppCommController extends BaseController {
  @Inject('cool:eps:open')
  eps;

  @Inject('cool:cache')
  coolCache: ICoolCache;

  @Inject('cool:file')
  coolFile: ICoolFile;

  @Inject()
  ctx: Context;

  /**
   * 实体信息与路径
   * @returns
   */
  @Get('/eps', { summary: '实体信息与路径' })
  public async getEps() {
    console.log(this.coolCache.getMode());
    return this.ok(this.eps);
  }

  /**
   * 文件上传
   */
  @Post('/upload', { summary: '文件上传' })
  async upload() {
    return this.ok(await this.coolFile.upload(this.ctx));
  }

  /**
   * 文件上传模式，本地或者云存储
   */
  @Get('/uploadMode', { summary: '文件上传模式' })
  async uploadMode() {
    return this.ok(this.coolFile.getMode());
  }
}
