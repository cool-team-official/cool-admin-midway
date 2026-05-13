import {
  BaseController,
  CoolController,
  CoolTag,
  CoolUrlTag,
  TagTypes,
} from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { VideoAlbumEntity } from '../../entity/album';
import { AlbumVideoServer } from '../../service/album_video';
import { CryptoUtil } from '../../../../comm/crypto';

/**
 *
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: VideoAlbumEntity,
  insertParam: ctx => {
    return {
      // 获得当前登录的后台用户ID，需要请求头传Authorization参数
      createUserId: ctx.user.id,
    };
  },
  pageQueryOp: {
    fieldEq: ['category_id'],
  },
})
@CoolUrlTag({
  key: TagTypes.IGNORE_TOKEN,
  value: ['page', 'info'],
})
export class AppAlbumController extends BaseController {
  @Inject()
  albumService: AlbumVideoServer;

  @Inject()
  cryptoUtil: CryptoUtil;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/album', { summary: '获取专辑信息' })
  async album(@Body() body): Promise<unknown> {
    return this.ok(await this.albumService.album(body));
  }
}
