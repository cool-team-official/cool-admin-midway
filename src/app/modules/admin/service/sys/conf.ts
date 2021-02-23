import { Provide } from '@midwayjs/decorator';
import { BaseService } from 'midwayjs-cool-core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { AdminSysConfEntity } from '../../entity/sys/conf';

/**
 * 系统配置
 */
@Provide()
export class AdminSysConfService extends BaseService {

    @InjectEntityModel(AdminSysConfEntity)
    adminSysConfEntity: Repository<AdminSysConfEntity>;

    /**
     * 获得配置参数值
     * @param key
     */
    async getValue(key) {
        const conf = await this.adminSysConfEntity.findOne({ cKey: key });
        if (conf) {
            return conf.cValue;
        }
    }

    /**
     * 更新配置参数
     * @param cKey
     * @param cValue
     */
    async updateVaule(cKey, cValue) {
        await this.adminSysConfEntity.createQueryBuilder()
            .update()
            .set({ cKey, cValue })
            .execute();
    }
}