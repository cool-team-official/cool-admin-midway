/*
 Copyright © 2024-2026 Juzi Video. All rights reserved.
 版权所有 © 2024-2026 橘子视频。保留所有权利。
 作者：xiaoliwanshui
 邮箱：chocolaer@126.com

 ... 
*/

import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '../../base/service/base';
import { CollectionLogEntity } from '../entity/collection_log';
import { CollectionEntity } from '../entity/collection';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Brackets, In, LessThan, Repository } from 'typeorm';
import * as moment from 'moment';
import { BaseSysConfService } from '../../base/service/sys/conf';

@Provide()
export class CollectionLogService extends BaseService {
  @Inject()
  baseSysConfService: BaseSysConfService;

  @InjectEntityModel(CollectionLogEntity)
  collectionLogEntity: Repository<CollectionLogEntity>;

  async addLog(data: Partial<CollectionLogEntity>): Promise<void> {
    if (!data) {
      return;
    }
    await this.collectionLogEntity.insert(data);
  }

  async page(query: any): Promise<any> {
    const find = this.collectionLogEntity.createQueryBuilder('a');
    find.leftJoin(CollectionEntity, 'b', 'a.collection_id = b.id');
    find.select(['a.*', 'b.name as collectionName']);

    const keyWord = query?.keyWord?.trim?.() ?? query?.keyWord;
    if (keyWord) {
      find.andWhere(
        new Brackets(qb => {
          qb.where('b.name like :keyWord', { keyWord: `%${keyWord}%` })
            .orWhere('a.error_message like :keyWord', { keyWord: `%${keyWord}%` })
            .orWhere('a.request_url like :keyWord', { keyWord: `%${keyWord}%` });
        })
      );
    }

    if (
      query?.collection_id !== undefined &&
      query?.collection_id !== null &&
      query.collection_id !== ''
    ) {
      find.andWhere('a.collection_id = :collection_id', {
        collection_id: query.collection_id,
      });
    }

    if (
      query?.status !== undefined &&
      query?.status !== null &&
      query.status !== ''
    ) {
      find.andWhere('a.status = :status', { status: query.status });
    }

    if (
      query?.task_type !== undefined &&
      query?.task_type !== null &&
      query.task_type !== ''
    ) {
      find.andWhere('a.task_type = :task_type', { task_type: query.task_type });
    }

    find.orderBy('a.id', 'DESC');
    return this.entityRenderPage(find, query);
  }

  async clear(isAll?) {
    if (isAll) {
      await this.collectionLogEntity.clear();
      return;
    }
    const keepDay = await this.baseSysConfService.getValue('collectionLogKeep');
    if (keepDay) {
      const beforeDate = moment().add(-keepDay, 'days').startOf('day').toDate();
      await this.collectionLogEntity.delete({
        createTime: LessThan(beforeDate),
      });
    } else {
      await this.collectionLogEntity.clear();
    }
  }

  async setKeep(value: number) {
    await this.baseSysConfService.updateVaule('collectionLogKeep', value);
  }

  async getKeep() {
    return this.baseSysConfService.getValue('collectionLogKeep');
  }

  async delete(ids: number[]): Promise<void> {
    if (!ids || !ids.length) {
      return;
    }
    await this.collectionLogEntity.delete({ id: In(ids) });
  }
}
