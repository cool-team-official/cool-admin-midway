import { Provide } from '@midwayjs/decorator';
import { BaseService } from 'midwayjs-cool-core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { BaseSysRoleEntity } from '../../entity/sys/role';
import { BaseSysUserRoleEntity } from '../../entity/sys/user_role';
import * as _ from 'lodash';

/**
 * 角色
 */
@Provide()
export class BaseSysRoleService extends BaseService {

    @InjectEntityModel(BaseSysRoleEntity)
    baseSysRoleEntity: Repository<BaseSysRoleEntity>;

    @InjectEntityModel(BaseSysUserRoleEntity)
    baseSysUserRoleEntity: Repository<BaseSysUserRoleEntity>;

    /**
     * 根据用户ID获得所有用户角色
     * @param userId 
     */
    async getByUser(userId: number): Promise<number[]> {
        const userRole = await this.baseSysUserRoleEntity.find({ userId });
        if (!_.isEmpty(userRole)) {
            return userRole.map(e => {
                return e.roleId;
            });
        }
        return [];
    }
}