import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { In, Repository } from 'typeorm';
import { SpaceTypeEntity } from '../entity/type';
import { SpaceInfoEntity } from '../entity/info';

/**
 * 文件分类
 */
@Provide()
export class SpaceTypeService extends BaseService {
  @InjectEntityModel(SpaceTypeEntity)
  spaceTypeEntity: Repository<SpaceTypeEntity>;

  @InjectEntityModel(SpaceInfoEntity)
  spaceInfoEntity: Repository<SpaceInfoEntity>;

  /**
   * 删除
   * @param ids
   */
  async delete(ids: any) {
    await super.delete(ids);
    // 删除该分类下的文件信息
    await this.spaceInfoEntity.delete({ classifyId: In(ids) });
  }
}
