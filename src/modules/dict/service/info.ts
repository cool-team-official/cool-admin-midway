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
      .addOrderBy('a.createTime', 'ASC')
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

  /**
   * 修改之后
   * @param data
   * @param type
   */
  async modifyAfter(data: any, type: 'delete' | 'update' | 'add') {
    if (type === 'delete') {
      for (const id of data) {
        await this.delChildDict(id);
      }
    }
  }

  /**
   * 删除子字典
   * @param id
   */
  private async delChildDict(id) {
    const delDict = await this.dictInfoEntity.find({ parentId: id });
    if (_.isEmpty(delDict)) {
      return;
    }
    const delDictIds = delDict.map(e => {
      return e.id;
    });
    await this.dictInfoEntity.delete(delDictIds);
    for (const dictId of delDictIds) {
      await this.delChildDict(dictId);
    }
  }
}
