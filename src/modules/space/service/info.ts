import { SpaceInfoEntity } from './../entity/info';
import { Config, Provide } from '@midwayjs/decorator';
import { BaseService, CoolFileConfig, MODETYPE } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';

/**
 * 文件信息
 */
@Provide()
export class SpaceInfoService extends BaseService {
  @InjectEntityModel(SpaceInfoEntity)
  spaceInfoEntity: Repository<SpaceInfoEntity>;

  @Config('cool.file')
  config: CoolFileConfig;

  /**
   * 新增
   */
  async add(param) {
    if (this.config.mode == MODETYPE.LOCAL) {
      param.key = param.url.replace(this.config.domain, '');
    }
    return super.add(param);
  }
}
