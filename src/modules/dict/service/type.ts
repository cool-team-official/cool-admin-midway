import { DictInfoEntity } from './../entity/info';
import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository, In } from 'typeorm';

/**
 * 描述
 */
@Provide()
export class DictTypeService extends BaseService {
  @InjectEntityModel(DictInfoEntity)
  dictInfoEntity: Repository<DictInfoEntity>;

  /**
   * 删除
   * @param ids
   */
  async delete(ids) {
    super.delete(ids);
    await this.dictInfoEntity.delete({
      typeId: In(ids),
    });
  }
}
