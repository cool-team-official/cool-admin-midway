import { EntityModel } from '@midwayjs/orm';
import { PrimaryGeneratedColumn, Column } from 'typeorm';
 
@EntityModel('user')
export class User {
  @PrimaryGeneratedColumn({ name: "id" })
  id: number;
 
  @Column({ name: "name" })
  name: string;
}