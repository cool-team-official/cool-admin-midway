import {
  Index,
  UpdateDateColumn,
  CreateDateColumn,
  // @ts-ignore
  ObjectID,
  ObjectIdColumn,
} from "typeorm";
import { CoolBaseEntity } from "./typeorm";

/**
 * 模型基类
 */
export abstract class BaseMongoEntity extends CoolBaseEntity {
  @ObjectIdColumn({ comment: "id" })
  id: ObjectID;

  @Index()
  @CreateDateColumn({ comment: "创建时间" })
  createTime: Date;

  @Index()
  @UpdateDateColumn({ comment: "更新时间" })
  updateTime: Date;
}
