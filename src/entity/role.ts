import { EntityModel } from '@midwayjs/orm';
import { BaseModel } from 'midwayjs-cool-core';
import { Column } from 'typeorm';

@EntityModel('role')
export class Role extends BaseModel {

    @Column()
    name: string;
    
    @Column('bigint')
    userId: number;

}