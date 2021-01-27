import { App, Configuration } from '@midwayjs/decorator';
import { ILifeCycle, IMidwayContainer } from '@midwayjs/core';
import * as orm from '@midwayjs/orm';
import * as cool from '@midwayjs/cool-core';
import { listModule } from '@midwayjs/decorator';
import { Application } from 'egg';
import * as moment from 'moment';

@Configuration({
  imports: [
    // cool官方核心组件 官网：https://cool-js.com
    cool,
    // typeorm数据库组件 文档地址 https://typeorm.io/， 打不开可以用这个链接 https://typeorm.biunav.com/zh/
    orm
  ],
})
export class ContainerLifeCycle implements ILifeCycle {

  @App()
  app: Application;

  async onReady(container?: IMidwayContainer): Promise<void> {
    // 格式化时间
    Date.prototype.toJSON = function () {
      return moment(this).format('YYYY-MM-DD HH:mm:ss');
    };
    // 新增String支持replaceAll方法
    String.prototype['replaceAll'] = function (s1, s2) {
      return this.replace(new RegExp(s1, 'gm'), s2);
    };

    console.log('加载配置')
    // this.app.use(async (ctx, next) => {
    //   console.log('这边请求到了')
    //   await next();
    // });




    const MODEL_KEY = 'decorator:model';

    // 可以获取到所有装饰了 @Model 装饰器的 class
    const modules = listModule(MODEL_KEY);
    for (let mod of modules) {
      console.log(666, mod)
      // 实现自定义能力
      // 从 mod 上拿元数据，做不同的处理
      // 提前初始化等 app.applicationContext.getAsync(getProvideId(mod));
    }
  }
  async onStop?(container?: IMidwayContainer): Promise<void> {
    console.log('应用停止')
  }

}