import { Provide } from '@midwayjs/decorator';
import { BaseService } from 'midwayjs-cool-core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { AdminSysUserEntity } from '../../entity/sys/user';

/**
 * 系统用户
 */
@Provide()
export class AdminSysUserService extends BaseService {

    @InjectEntityModel(AdminSysUserEntity)
    adminSysUserEntity: Repository<AdminSysUserEntity>;

    /**
     * 移动部门
     * @param departmentId 
     * @param userIds 
     */
    async move(departmentId, userIds) {
        await this.adminSysUserEntity.createQueryBuilder()
            .update().set({ departmentId })
            .where('id =: (:userIds)', { userIds })
            .execute();
    }

    async test(){
        // const a = await this.adminSysUserEntity.find();
        // console.log(a);
    }
}