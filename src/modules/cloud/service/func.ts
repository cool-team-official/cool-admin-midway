import { CloudFuncLogEntity } from './../entity/func/log';
import { Config, IMidwayApplication } from '@midwayjs/core';
import { CloudFuncInfoEntity } from './../entity/func/info';
import { App, Provide, Inject } from '@midwayjs/decorator';
import { BaseService, CoolConfig, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';

// eslint-disable-next-line node/no-unpublished-import
import * as ts from 'typescript';
import { Context } from '@midwayjs/koa';
import {
  CloudCrud,
  CloudReq,
  CoolCloudDb,
  CoolCloudFunc,
} from '@cool-midway/cloud';

/**
 * 云函数
 */
@Provide()
export class CloudFuncService extends BaseService {
  @InjectEntityModel(CloudFuncInfoEntity)
  cloudFuncInfoEntity: Repository<CloudFuncInfoEntity>;

  @InjectEntityModel(CloudFuncLogEntity)
  cloudFuncLogEntity: Repository<CloudFuncLogEntity>;

  @App()
  app: IMidwayApplication;

  @Inject()
  ctx: Context;

  @Inject()
  coolCloudDb: CoolCloudDb;

  @Inject()
  coolCloudFunc: CoolCloudFunc;

  @Config('cool')
  coolConfig: CoolConfig;

  /**
   * 调用云函数
   * @param req
   * @param id
   * @param content 内容 调试的时候传过来
   * @returns
   */
  async invoke(req: CloudReq, id: number, content?: string) {
    const start = moment().valueOf();
    let funcInfo: CloudFuncInfoEntity;
    if (id) {
      funcInfo = await this.cloudFuncInfoEntity
        .createQueryBuilder()
        .cache(true)
        .where({ id, status: 1 })
        .getOne();
      req.name = funcInfo?.name;
    } else {
      funcInfo = await this.cloudFuncInfoEntity
        .createQueryBuilder()
        .cache(true)
        .where({ name: req.name, status: 1 })
        .getOne();
    }
    if (!funcInfo) {
      throw new CoolCommException('云函数不存在或被禁用');
    }
    if (!req.method) {
      throw new CoolCommException('调用方法不能为空');
    }
    let result;
    let func: CloudCrud;
    const code = content ? content : funcInfo.content;
    const className = this.coolCloudFunc.getClassName(code);
    const newCode = ts.transpile(
      `${code}
      func = new ${className}();
        `,
      {
        emitDecoratorMetadata: true,
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2018,
        removeComments: true,
      }
    );
    const log = new CloudFuncLogEntity();
    try {
      eval(newCode);

      func.ctx = this.ctx;
      func.app = this.app;
      func.coolCloudDb = this.coolCloudDb;
      func.coolConfig = this.coolConfig;
      await func.init(req);
      const apis: string[] = func.curdOption.api || [];
      // 判断是否可以执行6个通用方法
      if (
        ['add', 'delete', 'update', 'info', 'list', 'page'].includes(
          req.method
        ) &&
        !apis.includes(req.method)
      ) {
        throw new CoolCommException(
          `${req.method} 方法未在curdOption.api 中配置`
        );
      }
      // result = func.add({ name: 'aa', age: 22, test2: 1 });
      result = await func[req.method](req.params);
    } catch (error) {
      log.error = error.message;
    }
    log.infoId = funcInfo.id;
    log.request = req;
    log.result = result;
    log.type = log.error ? 0 : 1;
    const end = moment().valueOf();
    log.time = end - start;
    this.cloudFuncLogEntity.insert(log);
    if (id) {
      return log;
    } else {
      return result;
    }
  }
}
