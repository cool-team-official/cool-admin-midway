import * as _ from 'lodash';
import { createCustomMethodDecorator } from '@midwayjs/core';

type IsolationLevel =
  | 'READ UNCOMMITTED'
  | 'READ COMMITTED'
  | 'REPEATABLE READ'
  | 'SERIALIZABLE';

export interface TransactionOptions {
  connectionName?: string;
  isolation?: IsolationLevel;
}

// 装饰器内部的唯一 id
export const COOL_RPC_TRANSACTION = 'decorator:cool_rpc_transaction';

export function CoolRpcTransaction(
  option?: TransactionOptions
): MethodDecorator {
  return createCustomMethodDecorator(COOL_RPC_TRANSACTION, option);
}
