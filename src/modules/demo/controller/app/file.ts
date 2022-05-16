import { Get, Inject, Post, Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { Context } from 'koa';
import { CoolFile } from '@cool-midway/file';

/**
 * 文件上传
 */
@Provide()
@CoolController()
export class AppDemoFileController extends BaseController {
  @Inject()
  ctx: Context;

  @Inject()
  file: CoolFile;

  @Post('/upload', { summary: '文件上传' })
  async uplod() {
    return this.ok(await this.file.upload(this.ctx));
  }

  @Get('/uploadMode', { summary: '获得上传模式' })
  async uploadMode() {
    return this.ok(await this.file.getMode());
  }

  @Post('/downAndUpload', { summary: '下载并上传' })
  async downAndUpload() {
    return this.ok(
      await this.file.downAndUpload('https://cool-js.com/admin/show.png')
    );
  }
}
