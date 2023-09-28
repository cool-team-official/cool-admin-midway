import { Provide, Inject, Get, Post, Query } from '@midwayjs/decorator';
import {
  CoolController,
  BaseController,
  CoolEps,
  TagTypes,
  CoolUrlTag,
  CoolTag,
} from '@cool-midway/core';
import { Context } from '@midwayjs/koa';
import { CoolFile } from '@cool-midway/file';
import { BaseSysParamService } from '../../service/sys/param';

/**
 * 不需要登录的后台接口
 */
@CoolUrlTag()
@Provide()
@CoolController()
export class BaseAppCommController extends BaseController {
  @Inject()
  coolFile: CoolFile;

  @Inject()
  ctx: Context;

  @Inject()
  eps: CoolEps;

  @Inject()
  baseSysParamService: BaseSysParamService;

  @Get('/param', { summary: '参数配置' })
  async param(@Query('key') key: string) {
    return this.ok(await this.baseSysParamService.dataByKey(key));
  }

  /**
   * 实体信息与路径
   * @returns
   */
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/eps', { summary: '实体信息与路径' })
  public async getEps() {
    return this.ok(this.eps.app);
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
    return this.ok(await this.coolFile.getMode());
  }
}
