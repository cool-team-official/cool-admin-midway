import { IotDeviceEntity } from './../entity/device';
import { Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';

/**
 * 设备
 */
@Provide()
@Scope(ScopeEnum.Request, { allowDowngrade: true })
export class IotDeviceService extends BaseService {
  @InjectEntityModel(IotDeviceEntity)
  iotDeviceEntity: Repository<IotDeviceEntity>;

  /**
   * 注册设备
   * @param uniqueId
   * @param clientId
   */
  async register(uniqueId: string, clientId: string) {
    const info = await this.iotDeviceEntity.findOneBy({ uniqueId });
    if (info) {
      await this.iotDeviceEntity.update({ uniqueId }, { status: 1, clientId });
    } else {
      // await this.iotDeviceEntity.insert({ uniqueId, clientId, status: 1 });
    }
  }

  /**
   * 重置所有设备状态
   */
  async resetStatus() {
    await this.iotDeviceEntity
      .createQueryBuilder()
      .update()
      .set({ status: 0 })
      .execute();
  }

  /**
   * 改变设备状态
   * @param uniqueId
   * @param status
   */
  async changeStatus(uniqueId: string, status: number) {
    await this.iotDeviceEntity.update({ uniqueId }, { status });
  }
}
