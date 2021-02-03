import { BaseModel } from 'midwayjs-cool-core';
import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
 
@EntityModel('user')
export class User extends BaseModel{
 
  @Column({ name: "name" })
  name: string;
}