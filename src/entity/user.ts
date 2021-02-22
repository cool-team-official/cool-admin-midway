import { EntityModel } from '@midwayjs/orm';
import { BaseModel } from 'midwayjs-cool-core';
import { Column } from 'typeorm';
import { Rule, RuleType } from "@midwayjs/decorator";

@EntityModel('user')
export class User extends BaseModel {

    @Rule(RuleType.string().required())
    @Column()
    name: string;
    
    @Rule(RuleType.number().max(18))
    @Column('int')
    age: number;

}