import { RecycleDataEntity } from './../entity/data';
import { Inject, Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel, TypeORMDataSourceManager } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BaseSysConfService } from '../../base/service/sys/conf';

/**
 * 数据回收
 */
@Provide()
@Scope(ScopeEnum.Request, { allowDowngrade: true })
export class RecycleDataService extends BaseService {
  @InjectEntityModel(RecycleDataEntity)
  recycleDataEntity: Repository<RecycleDataEntity>;

  @Inject()
  typeORMDataSourceManager: TypeORMDataSourceManager;

  @Inject()
  baseSysConfService: BaseSysConfService;

  /**
   * 恢复数据
   * @param ids
   */
  async restore(ids: number[]) {
    for (const id of ids) {
      const info = await this.recycleDataEntity.findOneBy({ id });
      if (!info) {
        continue;
      }
      let entityModel = this.typeORMDataSourceManager
        .getDataSource(info.entityInfo.dataSourceName)
        .getRepository(info.entityInfo.entity);
      await entityModel.save(info.data);
      await this.recycleDataEntity.delete(id);
    }
  }

  /**
   * 记录数据
   * @param params
   */
  async record(params) {
    const { ctx, data, entity } = params;
    const dataSourceName =
      this.typeORMDataSourceManager.getDataSourceNameByModel(entity.target);
    const url = ctx?.url;
    await this.recycleDataEntity.save({
      entityInfo: {
        dataSourceName,
        entity: entity.target.name,
      },
      url,
      params:
        ctx?.req.method === 'GET' ? ctx?.request.query : ctx?.request.body,
      data,
      count: data.length,
      userId: _.startsWith(url, '/admin/') ? ctx?.admin.userId : ctx?.user?.id,
    });
  }

  /**
   * 日志
   * @param isAll 是否清除全部
   */
  async clear(isAll?) {
    if (isAll) {
      await this.recycleDataEntity.clear();
      return;
    }
    const keepDay = await this.baseSysConfService.getValue('recycleKeep');
    if (keepDay) {
      const beforeDate = `${moment()
        .add(-keepDay, 'days')
        .format('YYYY-MM-DD')} 00:00:00`;
      await this.recycleDataEntity
        .createQueryBuilder()
        .delete()
        .where('createTime < :createTime', { createTime: beforeDate })
        .execute();
    } else {
      await this.recycleDataEntity.clear();
    }
  }
}
