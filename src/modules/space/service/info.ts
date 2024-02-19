import { SpaceInfoEntity } from './../entity/info';
import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService, MODETYPE } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { PluginService } from '../../plugin/service/info';

/**
 * 文件信息
 */
@Provide()
export class SpaceInfoService extends BaseService {
  @InjectEntityModel(SpaceInfoEntity)
  spaceInfoEntity: Repository<SpaceInfoEntity>;

  @Inject()
  pluginService: PluginService;

  /**
   * 新增
   */
  async add(param) {
    const result = await this.pluginService.invoke('upload', 'getMode');
    const config = await this.pluginService.getConfig('upload');
    if (result.mode == MODETYPE.LOCAL) {
      param.key = param.url.replace(config.domain, '');
    }
    return super.add(param);
  }
}
