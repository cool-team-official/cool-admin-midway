import { createCustomMethodDecorator } from "@midwayjs/decorator";

type IsolationLevel =
  | "READ UNCOMMITTED"
  | "READ COMMITTED"
  | "REPEATABLE READ"
  | "SERIALIZABLE";

export interface TransactionOptions {
  connectionName?: string;
  isolation?: IsolationLevel;
}

// 装饰器内部的唯一 id
export const COOL_TRANSACTION = "decorator:cool_transaction";

export function CoolTransaction(option?: TransactionOptions): MethodDecorator {
  return createCustomMethodDecorator(COOL_TRANSACTION, option);
}
