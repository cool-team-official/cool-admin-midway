import {
  CoolController,
  BaseController,
  CoolTag,
  CoolUrlTag,
  TagTypes,
} from '@cool-midway/core';
import { PluginInfoEntity } from '../../entity/info';
import { Body, Fields, Files, Inject, Post } from '@midwayjs/core';
import { PluginService } from '../../service/info';

/**
 * 插件信息
 */
@CoolUrlTag({
  key: TagTypes.IGNORE_TOKEN,
  value: [],
})
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: PluginInfoEntity,
  service: PluginService,
  pageQueryOp: {
    select: [
      'a.id',
      'a.name',
      'a.keyName',
      'a.hook',
      'a.version',
      'a.status',
      'a.readme',
      'a.author',
      'a.logo',
      'a.description',
      'a.pluginJson',
      'a.config',
      'a.createTime',
      'a.updateTime',
    ],
    addOrderBy: {
      id: 'DESC',
    },
  },
})
export class AdminPluginInfoController extends BaseController {
  @Inject()
  pluginService: PluginService;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/install', { summary: '安装插件' })
  async install(@Files() files, @Fields() fields) {
    return this.ok(
      await this.pluginService.install(files[0].data, fields.force)
    );
  }
}
