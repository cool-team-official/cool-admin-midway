import { DictTypeEntity } from './../entity/type';
import { DictInfoEntity } from './../entity/info';
import { Config, Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
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

  @Config('typeorm.dataSource.default.type')
  ormType: string;

  /**
   * 获得字典数据
   * @param types
   */
  async data(types: string[]) {
    const result = {};
    let typeData = await this.dictTypeEntity.find();
    if (!_.isEmpty(types)) {
      typeData = await this.dictTypeEntity.findBy({ key: In(types) });
    }
    if (_.isEmpty(typeData)) {
      return {};
    }
    const data = await this.dictInfoEntity
      .createQueryBuilder('a')
      .select([
        'a.id',
        'a.name',
        'a.typeId',
        'a.parentId',
        'a.orderNum',
        'a.value',
      ])
      .where('a.typeId in(:...typeIds)', {
        typeIds: typeData.map(e => {
          return e.id;
        }),
      })
      .orderBy('a.orderNum', 'ASC')
      .addOrderBy('a.createTime', 'ASC')
      .getMany();
    for (const item of typeData) {
      result[item.key] = _.filter(data, { typeId: item.id }).map(e => {
        const value = e.value ? Number(e.value) : e.value;
        return {
          ...e,
          value: isNaN(value) ? e.value : value,
        };
      });
    }
    return result;
  }

  /**
   * 获得单个或多个字典值
   * @param value 字典值或字典值数组
   * @param key 字典类型
   * @returns
   */
  async getValues(value: string | string[], key: string) {
    // 获取字典类型
    const type = await this.dictTypeEntity.findOneBy({ key });
    if (!type) {
      return null; // 或者适当的错误处理
    }

    // 根据typeId获取所有相关的字典信息
    const dictValues = await this.dictInfoEntity.find({
      where: { typeId: type.id },
    });

    // 如果value是字符串，直接查找
    if (typeof value === 'string') {
      return this.findValueInDictValues(value, dictValues);
    }

    // 如果value是数组，遍历数组，对每个元素进行查找
    return value.map(val => this.findValueInDictValues(val, dictValues));
  }

  /**
   * 在字典值数组中查找指定的值
   * @param value 要查找的值
   * @param dictValues 字典值数组
   * @returns
   */
  findValueInDictValues(value: string, dictValues: any[]) {
    let result = dictValues.find(dictValue => dictValue.value === value);
    if (!result) {
      result = dictValues.find(dictValue => dictValue.id === parseInt(value));
    }
    return result ? result.name : null; // 或者适当的错误处理
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
    const delDict = await this.dictInfoEntity.findBy({ parentId: id });
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
