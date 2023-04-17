import {
  App,
  CONTROLLER_KEY,
  getClassMetadata,
  Init,
  Inject,
  Provide,
} from "@midwayjs/decorator";
import { RESCODE, RESMESSAGE } from "../constant/global";
import { ControllerOption, CurdOption } from "../decorator/controller";
import { BaseService } from "../service/base";
import { IMidwayApplication } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import { TypeORMDataSourceManager } from "@midwayjs/typeorm";

/**
 * 控制器基类
 */
@Provide()
export abstract class BaseController {
  @Inject("ctx")
  baseCtx: Context;

  @Inject()
  service: BaseService;

  @App()
  baseApp: IMidwayApplication;

  curdOption: CurdOption;

  @Inject()
  typeORMDataSourceManager: TypeORMDataSourceManager;

  connectionName;

  @Init()
  async init() {
    const option: ControllerOption = getClassMetadata(CONTROLLER_KEY, this);
    const curdOption: CurdOption = option.curdOption;
    this.curdOption = curdOption;
    if (!this.curdOption) {
      return;
    }
    // 操作之前
    await this.before(curdOption);
    // 设置service
    await this.setService(curdOption);
    // 设置实体
    await this.setEntity(curdOption);
  }

  private async before(curdOption: CurdOption) {
    if (!curdOption?.before) {
      return;
    }
    await curdOption.before(this.baseCtx, this.baseApp);
  }

  /**
   * 插入参数值
   * @param curdOption 配置
   */
  private async insertParam(curdOption: CurdOption) {
    if (!curdOption?.insertParam) {
      return;
    }
    this.baseCtx.request.body = {
      // @ts-ignore
      ...this.baseCtx.request.body,
      ...(await curdOption.insertParam(this.baseCtx, this.baseApp)),
    };
  }

  /**
   * 设置实体
   * @param curdOption 配置
   */
  private async setEntity(curdOption: CurdOption) {
    const entity = curdOption?.entity;
    if (entity) {
      const dataSourceName =
        this.typeORMDataSourceManager.getDataSourceNameByModel(entity);
      let entityModel = this.typeORMDataSourceManager
        .getDataSource(dataSourceName)
        .getRepository(entity);
      this.service.setEntity(entityModel);
    }
  }

  /**
   * 设置service
   * @param curdOption
   */
  private async setService(curdOption: CurdOption) {
    if (curdOption.service) {
      this.service = await this.baseCtx.requestContext.getAsync(
        curdOption.service
      );
    }
  }

  /**
   * 新增
   * @returns
   */
  async add() {
    // 插入参数
    await this.insertParam(this.curdOption);
    const { body } = this.baseCtx.request;
    return this.ok(await this.service.add(body));
  }

  /**
   * 删除
   * @returns
   */
  async delete() {
    // @ts-ignore
    const { ids } = this.baseCtx.request.body;
    return this.ok(await this.service.delete(ids));
  }

  /**
   * 更新
   * @returns
   */
  async update() {
    const { body } = this.baseCtx.request;
    return this.ok(await this.service.update(body));
  }

  /**
   * 分页查询
   * @returns
   */
  async page() {
    const { body } = this.baseCtx.request;
    return this.ok(
      await this.service.page(
        body,
        this.curdOption.pageQueryOp,
        this.connectionName
      )
    );
  }

  /**
   * 列表查询
   * @returns
   */
  async list() {
    const { body } = this.baseCtx.request;
    return this.ok(
      await this.service.list(
        body,
        this.curdOption.listQueryOp,
        this.connectionName
      )
    );
  }

  /**
   * 根据ID查询信息
   * @returns
   */
  async info() {
    const { id } = this.baseCtx.query;
    return this.ok(
      await this.service.info(id, this.curdOption.infoIgnoreProperty)
    );
  }

  /**
   * 成功返回
   * @param data 返回数据
   */
  ok(data?: any) {
    const res = {
      code: RESCODE.SUCCESS,
      message: RESMESSAGE.SUCCESS,
    };
    if (data || data == 0) {
      res["data"] = data;
    }
    return res;
  }

  /**
   * 失败返回
   * @param message
   */
  fail(message?: string, code?: RESCODE) {
    return {
      code: code ? code : RESCODE.COMMFAIL,
      message: message
        ? message
        : code == RESCODE.VALIDATEFAIL
        ? RESMESSAGE.VALIDATEFAIL
        : RESMESSAGE.COMMFAIL,
    };
  }
}
