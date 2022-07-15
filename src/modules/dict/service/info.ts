import { DictTypeEntity } from './../entity/type';
import { DictInfoEntity } from './../entity/info';
import { Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository, In } from 'typeorm';
import * as _ from 'lodash';

/**
 * 字典信息
 */
@Provide()
export class DictInfoService extends BaseService {
  @InjectEntityModel(DictInfoEntity)
  dictInfoEntity: Repository<DictInfoEntity>;

  @InjectEntityModel(DictTypeEntity)
  dictTypeEntity: Repository<DictTypeEntity>;

  /**
   * 获得字典数据
   * @param types
   */
  async data(types: string[]) {
    const result = {};
    const find = await this.dictTypeEntity.createQueryBuilder();
    if (!_.isEmpty(types)) {
      find.where('`key` in(:key)', { key: types });
    }
    const typeData = await find.getMany();
    if (_.isEmpty(typeData)) {
      return {};
    }
    const data = await this.dictInfoEntity
      .createQueryBuilder('a')
      .select(['a.id', 'a.name', 'a.typeId', 'a.parentId'])
      .where('typeId in(:typeIds)', {
        typeIds: typeData.map(e => {
          return e.id;
        }),
      })
      .orderBy('orderNum', 'ASC')
      .getMany();
    for (const item of typeData) {
      result[item.key] = _.filter(data, { typeId: item.id });
    }
    return result;
  }

  /**
   * 获得字典值
   * @param infoId
   * @returns
   */
  async value(infoId: number) {
    const info = await this.dictInfoEntity.findOne({ id: infoId });
    return info?.name;
  }

  /**
   * 获得字典值
   * @param infoId
   * @returns
   */
  async values(infoIds: number[]) {
    const infos = await this.dictInfoEntity.find({ id: In(infoIds) });
    return infos.map(e => {
      return e.name;
    });
  }
}
