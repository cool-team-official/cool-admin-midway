import { Provide } from '@midwayjs/decorator';
import { BaseService } from 'midwayjs-cool-core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { BaseSysDepartmentEntity } from '../../entity/sys/department';
import * as _ from 'lodash';
import { BaseSysRoleDepartmentEntity } from '../../entity/sys/role_department';

/**
 * 描述
 */
@Provide()
export class BaseSysDepartmentService extends BaseService {

    @InjectEntityModel(BaseSysDepartmentEntity)
    baseSysDepartmentEntity: Repository<BaseSysDepartmentEntity>;

    @InjectEntityModel(BaseSysRoleDepartmentEntity)
    baseSysRoleDepartmentEntity: Repository<BaseSysRoleDepartmentEntity>;

    /**
     * 根据多个ID获得部门权限信息
     * @param {[]} roleIds 数组
     * @param isAdmin 是否超管
     */
    async getByRoleIds(roleIds: number[], isAdmin) {
        if (!_.isEmpty(roleIds)) {
            if (isAdmin) {
                const result = await this.baseSysDepartmentEntity.find();
                return result.map(e => {
                    return e.id;
                });
            }
            const result = await this.baseSysRoleDepartmentEntity.createQueryBuilder().where('roleId in (:roleIds)', { roleIds }).getMany();
            if (!_.isEmpty(result)) {
                return _.uniq(result.map(e => {
                    return e.departmentId;
                }));
            }
        }
        return [];
    }
}