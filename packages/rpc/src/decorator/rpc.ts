import {
  Scope,
  ScopeEnum,
  saveClassMetadata,
  saveModule,
} from '@midwayjs/decorator';

export const MOLECYLER_KEY = 'decorator:cool:rpc';

export type MethodTypes =
  | 'add'
  | 'delete'
  | 'update'
  | 'page'
  | 'info'
  | 'list';

// 字段匹配
export interface FieldEq {
  // 字段
  column: string;
  // 请求参数
  requestParam: string;
}

// 关联查询
export interface LeftJoinOp {
  // 实体
  entity: any;
  // 别名
  alias: string;
  // 关联条件
  condition: string;
}

// Crud配置
export interface CurdOption {
  // 路由前缀，不配置默认是按Controller下的文件夹路径
  prefix?: string;
  // curd api接口
  method: MethodTypes[];
  // 分页查询配置
  pageQueryOp?: QueryOp;
  // 非分页查询配置
  listQueryOp?: QueryOp;
  // 插入参数
  insertParam?: Function;
  // info 忽略返回属性
  infoIgnoreProperty?: string[];
  // 实体
  entity: { entityKey?: any; connectionName?: string } | any;
}

// 查询配置
export interface QueryOp {
  // 需要模糊查询的字段
  keyWordLikeFields?: string[];
  // 查询条件
  where?: Function;
  // 查询字段
  select?: string[];
  // 字段相等
  fieldEq?: string[] | FieldEq[];
  // 添加排序条件
  addOrderBy?: {};
  // 关联配置
  leftJoin?: LeftJoinOp[];
}

/**
 * moleculer 微服务配置
 * @param option
 * @returns
 */
export function CoolRpcService(option?: CurdOption): ClassDecorator {
  return (target: any) => {
    // 将装饰的类，绑定到该装饰器，用于后续能获取到 class
    saveModule(MOLECYLER_KEY, target);
    // 保存一些元数据信息，任意你希望存的东西
    saveClassMetadata(MOLECYLER_KEY, option, target);
    // 指定 IoC 容器创建实例的作用域，这里注册为请求作用域，这样能取到 ctx
    Scope(ScopeEnum.Request)(target);
  };
}
