/*
 Copyright © 2024-2026 Juzi Video. All rights reserved.
 版权所有 © 2024-2026 橘子视频。保留所有权利。
 作者：xiaoliwanshui
 邮箱：chocolaer@126.com


 ============================================================================
                                版权声明
 ============================================================================


 本软件（以下简称"本软件"）受中华人民共和国著作权法及国际著作权条约保护。


 【版权人】橘子视频 (Juzi Video)
 【权利范围】本软件的全部源代码、二进制文件、文档及相关材料


 ============================================================================
                                许可证协议
 ============================================================================


 本软件仅授权用户进行以下操作：


  ✓ 可免费试用：下载并运行本软件，仅限个人非商业用途
  ✓ 可学习研究：查看和学习本软件源代码，仅供个人研究


 ============================================================================
                                禁止事项
 ============================================================================


  ✗ 禁止商业使用：未经授权，不得对本软件进行销售、授权、出租或商业利用
  ✗ 禁止修改演绎：未经授权，不得对本软件进行修改、反向工程或创作衍生作品
  ✗ 禁止分发传播：未经授权，不得以任何形式向第三方分发或公开本软件
  ✗ 禁止删除版权：不得移除或篡改本软件中的任何版权声明或知识产权标识


 ============================================================================
                                免责声明
 ============================================================================


 本软件按"原样"提供，不提供任何明示或暗示的保证，包括但不限于：
 对适销性、特定用途适用性、非侵权性的保证。在任何情况下，
 版权持有人均不对因使用本软件而产生的任何索赔、损害或损失承担责任。


 ============================================================================
                                终止条款
 ============================================================================


 若您违反本协议的任何条款，本许可证将自动终止。
 终止后，您必须立即停止使用本软件，并销毁所有相关副本。


 ============================================================================
                                法律适用
 ============================================================================


 本协议受中华人民共和国法律管辖，并按其解释。


 ============================================================================
                                联系我们
 ============================================================================


 如需商业授权或其他合作事宜，请联系版权方。


 ---


 本软件受著作权法和国际条约保护。
 未经授权的复制、修改、分发或商业使用将被追究法律责任。
*/

import { DictTypeEntity } from './../entity/type';
import { DictInfoEntity } from './../entity/info';
import { Config, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { In, Repository } from 'typeorm';
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
        'a.status',
        'a.color',
        'a.color',
        'a.remark'
      ])
      .where('a.typeId in(:...typeIds) and status = 1', {
        typeIds: typeData.map(e => {
          return e.id;
        })
      })
      .orderBy('a.orderNum', 'ASC')
      .addOrderBy('a.createTime', 'ASC')
      .getMany();
    for (const item of typeData) {
      result[item.key] = _.filter(data, { typeId: item.id }).map(e => {
        const value = e.value ? Number(e.value) : e.value;
        return {
          ...e,
          // @ts-ignore
          value: isNaN(value) ? e.value : value
        };
      });
    }
    return result;
  }

  /**
   * 获得字典key
   * @returns
   */
  async types() {
    return await this.dictTypeEntity.find();
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
      where: { typeId: type.id }
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
   * 根据name查找字典
   */
  async findByName(name: string) {
    return await this.dictInfoEntity.findOneBy({ name });
  }

  /**
   * 添加数据
   */
  async insertData(data: any) {
    return await this.dictInfoEntity.insert(data);
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
