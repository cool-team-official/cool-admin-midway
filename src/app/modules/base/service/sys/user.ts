import { Provide } from '@midwayjs/decorator';
import { BaseService } from 'midwayjs-cool-core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { BaseSysUserEntity } from '../../entity/sys/user';

/**
 * 系统用户
 */
@Provide()
export class BaseSysUserService extends BaseService {

    @InjectEntityModel(BaseSysUserEntity)
    baseSysUserEntity: Repository<BaseSysUserEntity>;

    /**
     * 移动部门
     * @param departmentId 
     * @param userIds 
     */
    async move(departmentId, userIds) {
        await this.baseSysUserEntity.createQueryBuilder()
            .update().set({ departmentId })
            .where('id =: (:userIds)', { userIds })
            .execute();
    }

    /**
     * 获得个人信息
     */
    async person() {
        return await this.baseSysUserEntity.findOne({ id: this.ctx.admin.userId })
    }
}