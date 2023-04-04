import {
  App,
  Context,
  ILifeCycle,
  ILogger,
  IMidwayBaseApplication,
  IMidwayContainer,
  Inject,
  Logger,
} from "@midwayjs/core";
import { Configuration } from "@midwayjs/decorator";
import * as DefaultConfig from "./config/config.default";
import { CoolExceptionFilter } from "./exception/filter";
import { FuncUtil } from "./util/func";
import location from "./util/location";
import * as koa from "@midwayjs/koa";
import { CoolModuleConfig } from "./module/config";
import { CoolModuleImport } from "./module/import";
import { CoolEventManager } from "./event";
import { CoolEps } from "./rest/eps";
import { CacheManager } from "@midwayjs/cache";
import * as cache from "@midwayjs/cache";
import { CoolDecorator } from "./decorator";

@Configuration({
  namespace: "cool",
  imports: [cache],
  importConfigs: [
    {
      default: DefaultConfig,
    },
  ],
})
export class CoolConfiguration implements ILifeCycle {
  @Logger()
  coreLogger: ILogger;

  @App()
  app: koa.Application;

  @Inject()
  coolEventManager: CoolEventManager;

  async onReady(container: IMidwayContainer) {
    this.coolEventManager.emit("onReady");
    // 处理模块配置
    await container.getAsync(CoolModuleConfig);
    // 导入模块数据
    await container.getAsync(CoolModuleImport);
    // 常用函数处理
    await container.getAsync(FuncUtil);
    // 事件
    await container.getAsync(CoolEventManager);
    // 异常处理
    this.app.useFilter([CoolExceptionFilter]);
    // 装饰器
    await container.getAsync(CoolDecorator);

    if (this.app.getEnv() == "local") {
      // 实体与路径
      const eps: CoolEps = await container.getAsync(CoolEps);
      eps.init();
    }
    // 缓存设置为全局
    global["COOL-CACHE"] = await container.getAsync(CacheManager);
    // 清除 location
    setTimeout(() => {
      location.clean();
      this.coreLogger.info("\x1B[36m [cool:core] location clean \x1B[0m");
    }, 10000);
  }

  async onConfigLoad(
    container: IMidwayContainer,
    mainApp?: IMidwayBaseApplication<Context>
  ) {}

  async onServerReady() {
    this.coolEventManager.emit("onServerReady");
    location.clean();
  }
}
