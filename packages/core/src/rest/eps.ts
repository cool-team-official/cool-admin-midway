import {
  CONTROLLER_KEY,
  getClassMetadata,
  listModule,
  Provide,
  Scope,
  ScopeEnum,
} from "@midwayjs/decorator";
import * as _ from "lodash";
import { Inject, MidwayWebRouterService } from "@midwayjs/core";
import { TypeORMDataSourceManager } from "@midwayjs/typeorm";

/**
 * 实体路径
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class CoolEps {
  admin = {};

  app = {};

  @Inject()
  midwayWebRouterService: MidwayWebRouterService;

  @Inject()
  typeORMDataSourceManager: TypeORMDataSourceManager;

  // @Init()
  async init() {
    const entitys = await this.entity();
    const controllers = await this.controller();
    const routers = await this.router();
    const adminArr = [];
    const appArr = [];
    for (const controller of controllers) {
      const { prefix, module, curdOption } = controller;
      const name = curdOption?.entity?.name;
      (_.startsWith(prefix, "/admin/") ? adminArr : appArr).push({
        module,
        api: routers[prefix],
        name,
        columns: entitys[name] || [],
        prefix,
      });
    }
    this.admin = _.groupBy(adminArr, "module");
    this.app = _.groupBy(appArr, "module");
  }

  /**
   * 所有controller
   * @returns
   */
  async controller() {
    const result = [];
    const controllers = listModule(CONTROLLER_KEY);
    for (const controller of controllers) {
      result.push(getClassMetadata(CONTROLLER_KEY, controller));
    }

    return result;
  }

  /**
   * 所有路由
   * @returns
   */
  async router() {
    return _.groupBy(
      (await await this.midwayWebRouterService.getFlattenRouterTable()).map(
        (item) => {
          return {
            method: item.requestMethod,
            path: item.url,
            summary: item.summary,
            dts: {},
            tag: "",
            prefix: item.prefix,
          };
        }
      ),
      "prefix"
    );
  }

  /**
   * 所有实体
   * @returns
   */
  async entity() {
    const result = {};
    const dataSourceNames = this.typeORMDataSourceManager.getDataSourceNames();
    for (const dataSourceName of dataSourceNames) {
      const entityMetadatas = await this.typeORMDataSourceManager.getDataSource(
        dataSourceName
      ).entityMetadatas;
      for (const entityMetadata of entityMetadatas) {
        const commColums = [];
        let columns = entityMetadata.columns;
        columns = _.filter(
          columns.map((e) => {
            return {
              propertyName: e.propertyName,
              type:
                typeof e.type == "string" ? e.type : e.type.name.toLowerCase(),
              length: e.length,
              comment: e.comment,
              nullable: e.isNullable,
            };
          }),
          (o) => {
            if (["createTime", "updateTime"].includes(o.propertyName)) {
              commColums.push(o);
            }
            return o && !["createTime", "updateTime"].includes(o.propertyName);
          }
        ).concat(commColums);
        result[entityMetadata.name] = columns;
      }
    }
    return result;
  }
}
