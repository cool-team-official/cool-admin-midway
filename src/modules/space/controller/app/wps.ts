import {
  ALL,
  Body,
  Files,
  Get,
  Inject,
  Param,
  Post,
  Provide,
  Query,
} from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { SpaceWpsService } from '../../service/wps';

/**
 * wps回调
 */
@Provide()
@CoolController('/wps')
export class AppSpaceWpsController extends BaseController {
  @Inject()
  spaceWpsService: SpaceWpsService;

  @Get('/v3/3rd/files/:file_id', { summary: '获取文件信息' })
  async files(@Param('file_id') file_id: string) {
    return await this.spaceWpsService.getFiles(file_id);
  }

  @Get('/v3/3rd/files/:file_id/download', { summary: '获取文件下载地址' })
  async download(@Param('file_id') file_id: string) {
    return await this.spaceWpsService.download(file_id);
  }

  @Get('/v3/3rd/files/:file_id/permission', { summary: '获取文档用户权限' })
  async permission(@Param('file_id') file_id: string) {
    return await this.spaceWpsService.permission(file_id);
  }

  @Post('/v3/3rd/files/:file_id/upload', { summary: '文件上传' })
  async upload(@Param('file_id') file_id: string, @Files() files) {
    return await this.spaceWpsService.upload(file_id, files);
  }

  @Get('/v3/3rd/files/:file_id/upload/prepare', { summary: '准备上传阶段' })
  async uploadPrepare(@Param('file_id') file_id: string) {
    return await this.spaceWpsService.uploadPrepare(file_id);
  }

  @Post('/v3/3rd/files/:file_id/upload/address', { summary: '获取上传地址' })
  async uploadAddress(@Param('file_id') file_id: string, @Body(ALL) body) {
    return await this.spaceWpsService.uploadAddress(file_id, body);
  }

  @Post('/v3/3rd/files/:file_id/upload/complete', {
    summary: '上传完成后，回调通知上传结果',
  })
  async uploadComplete(@Param('file_id') file_id: string, @Body(ALL) body) {
    return await this.spaceWpsService.uploadComplete(file_id, body);
  }

  @Get('/v3/3rd/users', { summary: '用户信息' })
  async users(@Query('user_ids') user_ids: string[]) {
    return await this.spaceWpsService.users(user_ids);
  }
}
