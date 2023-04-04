import {
  App,
  getClassMetadata,
  Init,
  listModule,
  Provide,
  Scope,
  ScopeEnum,
} from "@midwayjs/decorator";
import * as Events from "events";
import { IMidwayApplication } from "@midwayjs/core";
import { COOL_CLS_EVENT_KEY, COOL_EVENT_KEY } from "../decorator/event";

/**
 * 事件
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class CoolEventManager extends Events {
  @App()
  app: IMidwayApplication;

  @Init()
  async init() {
    const eventModules = listModule(COOL_CLS_EVENT_KEY);
    for (const module of eventModules) {
      this.handlerEvent(module);
    }
  }

  async handlerEvent(module) {
    const events = getClassMetadata(COOL_EVENT_KEY, module);
    for (const event of events) {
      const method = event.eventName ? event.eventName : event.propertyKey;
      this.on(method, async (...args) => {
        const moduleInstance = await this.app
          .getApplicationContext()
          .getAsync(module);
        moduleInstance[event.propertyKey](...args);
      });
    }
  }
}
