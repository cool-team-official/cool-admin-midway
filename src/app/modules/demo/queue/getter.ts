import { Provide, Scope, ScopeEnum } from '@midwayjs/decorator';
import { BaseCoolQueue, Queue } from '@cool-midway/queue';

/**
 * 主动消费队列
 */
@Queue()
@Scope(ScopeEnum.Singleton)
@Provide()
export class DemoGetterQueue extends BaseCoolQueue {}
