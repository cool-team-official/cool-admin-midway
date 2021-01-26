import { EntityModel } from '@midwayjs/orm';
import { Column, Index } from 'typeorm';
import { BaseModel } from '@midwayjs/cool-core';

/**
 * 系统角色
 */
@EntityModel('sys_role')
export class SysRole extends BaseModel{
    // 名称
    @Column()
    userId: string;
    // 名称
    @Index({ unique: true })
    @Column()
    name: string;
    // 角色标签
    @Index({ unique: true })
    @Column({ nullable: true, length: 50 })
    label: string;
    // 备注
    @Column({ nullable: true })
    remark: string;
}
