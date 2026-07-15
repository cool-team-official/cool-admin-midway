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

import { ILogger, Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionCategoryEntity } from '../entity/collection_category';
import axios from 'axios';
import { DictInfoService } from '../../dict/service/info';
import { DictInfoEntity } from '../../dict/entity/info';
import { NetworkErrorHandler } from './networkErrorHandler';
import { CollectionEntity } from '../entity/collection';

const TAG = 'CategoryService';

@Provide()
export class CategoryService {
  @InjectEntityModel(CollectionCategoryEntity)
  collectionCategoryEntity: Repository<CollectionCategoryEntity>;

  @Inject()
  logger: ILogger;

  @Inject()
  dictInfoService: DictInfoService;

  @Inject()
  networkErrorHandler: NetworkErrorHandler;

  /**
   * 同步分类
   *
   * @param query - 请求参数对象
   * @param query.address - 要同步的分类数据地址
   * @param query.data_method - 数据处理方法标识，1 表示启用分类保存逻辑
   * @param query.id - 集合 ID
   * @param query.name - 集合名称
   *
   * @returns 返回同步后的分类列表
   */
  async syncCategory(query: CollectionEntity): Promise<any> {
    try {
      let list = [];

      // 使用网络错误处理器进行请求
      this.logger.info(TAG, `开始同步分类: ${query.address}`);
      const result: any = await this.networkErrorHandler.requestWithRetry(
        {
          url: query.address,
          method: 'GET',
          ...this.networkErrorHandler.getCollectionAxiosConfig(),
        },
        3, // 最大重试3次
        2000 // 初始延迟2秒
      );

      list = await this.handleCategoryList(result.data.class, query);
      return { list };
    } catch (error) {
      if (this.networkErrorHandler.isNetworkError(error)) {
        const errorDetails =
          this.networkErrorHandler.getNetworkErrorDetails(error);
        this.logger.error(TAG, `分类同步网络错误: ${errorDetails}`);

        if (this.networkErrorHandler.isDnsError(error)) {
          this.logger.warn(
            TAG,
            `分类同步DNS解析失败，请检查URL: ${query.address}`
          );
        }
      } else {
        this.logger.error(TAG, '分类同步失败:', error);
      }
      throw error;
    }
  }

  /**
   * 处理分类列表数据
   *
   * @param classList - 分类数据数组
   * @param query - 同步参数，包含集合信息
   */
  async handleCategoryList(classList: any[] | string, query: any) {
    let parsedClassList = classList;

    if (typeof classList === 'string') {
      try {
        parsedClassList = JSON.parse(classList);
      } catch (error) {
        this.logger.error(TAG, '分类数据格式错误: JSON 解析失败');
        return [];
      }
    }

    if (!Array.isArray(parsedClassList)) {
      this.logger.error(TAG, '分类数据格式错误: 非数组结构');
      return [];
    }

    const savePromises = parsedClassList.map(async item => {
      await this.saveCategory({
        parentId: item.type_pid,
        class_id: item.type_id,
        class_name: item.type_name,
        collection_id: query.id,
        collection_name: query.name,
      });
    });

    await Promise.all(savePromises);
    const data: CollectionCategoryEntity[] =
      await this.collectionCategoryEntity.findBy({
        collection_id: query.id,
      });
    return this.updateParentId(data);
  }

  /**
   * 更新分类的父级 ID，将基于 class_pid 字段查找对应的父级记录，并将其主键 ID 赋值给 parentId 字段。
   *
   * @param data - 分类数据数组，包含当前所有分类信息
   * @returns 返回更新后的分类数据数组
   */
  updateParentId(data: CollectionCategoryEntity[]): CollectionCategoryEntity[] {
    // 创建一个映射，用于快速查找 class_id 对应的记录
    const classIdMap = {};
    data.forEach(item => {
      classIdMap[item.class_id] = item;
    });

    // 遍历数据，更新 parentId
    data.forEach(item => {
      if (item.class_pid !== '0') {
        const parentClassId = parseInt(item.class_pid, 10); // 转换为数字
        const parentItem = classIdMap[parentClassId];
        if (parentItem) {
          item.parentId = parentItem.id;
        }
        this.collectionCategoryEntity.update(item.id, item);
      }
    });

    return data;
  }

  /**
   * 保存分类信息到数据库
   *
   * @param category - 分类数据对象
   * @param category.class_id - 分类的唯一标识 ID
   * @param category.class_name - 分类名称
   * @param category.parentId - 父级分类的 ID
   * @param category.collection_id - 所属集合 ID
   * @param category.collection_name - 所属集合名称
   *
   * 如果传入的 category 中缺少 class_id 或 class_name，
   * 将尝试使用 type_id 和 type_name 字段作为替代值。
   */
  async saveCategory(category: any) {
    try {
      this.logger.info(TAG, category);
      await this.collectionCategoryEntity.insert({
        class_id: category.class_id || category.type_id,
        class_name: category.class_name || category.type_name,
        class_pid: category.parentId,
        collection_id: category.collection_id,
        collection_name: category.collection_name,
      });
    } catch (error) {
      this.logger.error(TAG, 'insert error data is has');
    }
  }

  /**
   * 快速匹配分类函数
   * 过滤出所有 sys_category_id 为空的记录，并与字典表中的 video_category 分类进行匹配。
   * 如果 CollectionCategoryEntity 的 class_name 与 DictInfoEntity 的 name 相同，
   * 则将对应的 sys_category_id 更新为字典表中分类的 id。
   */
  async matchCategory() {
    //先过滤出所有sys_category_id为空的数据
    const data = await this.collectionCategoryEntity.findBy({
      sys_category_id: null,
    });
    let videoCategoryEntityList: DictInfoEntity[] = (
      await this.dictInfoService.data(['video_category'])
    )['video_category'];
    //遍历data并判断data中的class_name是否和videoCategoryEntityList中的name相同，如果相同则更新sys_category_id为videoCategoryEntityList中的id
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < videoCategoryEntityList.length; j++) {
        if (data[i].class_name == videoCategoryEntityList[j].name) {
          await this.collectionCategoryEntity.update(data[i].id, {
            sys_category_id: videoCategoryEntityList[j].id,
          });
        }
      }
    }
  }
}
