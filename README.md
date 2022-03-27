<p align="center">
  <a href="https://midwayjs.org/" target="blank"><img src="https://cool-show.oss-cn-shanghai.aliyuncs.com/admin/logo.png" width="200" alt="Midway Logo" /></a>
</p>

<p align="center">cool-admin(midway版)一个很酷的后台权限管理系统，开源免费，模块化、插件化、极速开发CRUD，方便快速构建迭代后台管理系统，支持serverless、docker、普通服务器等多种方式部署
到 <a href="https://cool-js.com" target="_blank">文档</a> 进一步了解
<p align="center">
    <a href="https://github.com/cool-team-official/cool-admin-midway/blob/master/LICENSE" target="_blank"><img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="GitHub license" />
    <a href=""><img src="https://img.shields.io/github/package-json/v/cool-team-official/cool-admin-midway?style=flat-square" alt="GitHub tag"></a>
    <img src="https://img.shields.io/github/last-commit/cool-team-official/cool-admin-midway?style=flat-square" alt="GitHub tag"></a>
</p>

## 技术栈

* 后端：**`node.js` `midway.js` `egg.js` `mysql` `typescript`**
* 前端：**`vue.js` `element-ui` `jsx` `vuex` `vue-router`**

如果你是前端，后端的这些技术选型对你是特别友好的，前端开发者可以较快速地上手。
如果你是后端，Typescript的语法又跟java、php等特别类似，一切看起来也是那么得熟悉。

<!-- 在此次添加使用文档 -->
## 演示
[https://show.cool-admin.com](https://show.cool-admin.com)

* 账户：admin
* 密码：123456

<img src="https://cool-show.oss-cn-shanghai.aliyuncs.com/admin/home-mini.png" alt="Admin Home"></a>
#### 文档
[https://admin.cool-js.com](https://admin.cool-js.com)

#### 项目前端

[https://github.com/cool-team-official/cool-admin-vue](https://github.com/cool-team-official/cool-admin-vue)

## 微信群

<img width="260" src="https://cool-show.oss-cn-shanghai.aliyuncs.com/admin/wechat.jpeg?v=1" alt="Admin Wechat"></a>


## 运行

#### 修改数据库配置，配置文件位于`src/config/config.local.ts`

数据库为mysql(`>=5.7版本`)，node版本(`>=12.x`)，首次启动会自动初始化并导入数据

```ts
orm: {
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'cool',
    // 自动建表 注意：线上部署的时候不要使用，有可能导致数据丢失
    synchronize: true,
    // 打印日志
    logging: true,
    // 字符集
    charset: 'utf8mb4',
  },
```

#### 安装依赖并运行

```bash
$ npm i
$ npm run dev
$ open http://localhost:8001/
```

注： `npm i`如果安装失败可以尝试使用[cnpm](https://developer.aliyun.com/mirror/NPM?from=tnpm)，或者切换您的镜像源

## CURD(快速增删改查)

大部分的后台管理系统，或者API服务都是对数据进行管理，所以可以看到大量的CRUD场景(增删改查)，cool-admin对此进行了大量地封装，让这块的编码量变得极其地少。


#### 新建一个数据表

`src/modules/demo/entity/goods.ts`，项目启动数据库会自动创建该表，无需手动创建

```ts
import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@cool-midway/core';
import { Column } from 'typeorm';

/**
 * 商品
 */
@EntityModel('demo_app_goods')
export class DemoAppGoodsEntity extends BaseEntity {

    @Column({ comment: '标题' })
    title: string;

    @Column({ comment: '图片' })
    pic: string;

    @Column({ comment: '价格', type: 'decimal', precision: 5, scale: 2 })
    price: number;

}

```

#### 编写api接口

`src/modules/demo/controller/app/goods.ts`，快速编写6个api接口

```ts
import { Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { DemoAppGoodsEntity } from '../../entity/goods';

/**
 * 商品
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: DemoAppGoodsEntity
})
export class DemoAppGoodsController extends BaseController {
  /**
   * 其他接口
   */
  @Get('/other')
  async other() {
    return this.ok('hello, cool-admin!!!');
  }
}
```

这样我们就完成了6个接口的编写，对应的接口如下：

- `POST /app/demo/goods/add` 新增
- `POST /app/demo/goods/delete` 删除
- `POST /app/demo/goods/update` 更新
- `GET  /app/demo/goods/info` 单个信息
- `POST /app/demo/goods/list` 列表信息
- `POST /app/demo/goods/page` 分页查询(包含模糊查询、字段全匹配等)


### 部署

```bash
$ npm start
$ npm stop
```

### 内置指令

- 使用 `npm run lint` 来做代码风格检查。
- 使用 `npm test` 来执行单元测试。


[midway]: https://midwayjs.org


### 服务器

#### 腾讯云特供

不限新老用户，注册过买过都可以享受

|配置|价格|条件|备注|
|---------|-------|-------|-------|
|2核2g2M|一年240|个人企业限一台（不限新老用户）||
|2核4g2M|一年260、两年380|个人企业限一台（不限新老用户）||
|2核4g3M|一年260、三年600|企业（不限新老用户）||
|2核4g5M|一年280、三年660|企业（不限新老用户）||
|4核8g5M|一年320、三年720|企业（不限新老用户）||
|4核8g10M|一年560、三年1520|企业（不限新老用户）||
|8核16g5M|一年1800、三年3800|限企业新用户|送独立数据库|
|8核16g10M|一年2200、三年6600|限企业新用户|送独立数据库|
|16核32g5M|一年2600、三年6900|限企业新用户|送独立数据库|
|16核32g10M|一年2900、三年9600|限企业新用户|送独立数据库|

#### 购买咨询，数量有限！！！

<img width="260" src="https://cool-show.oss-cn-shanghai.aliyuncs.com/admin/wechat.jpeg?v=1" alt="Admin Wechat"></a>

#### 阿里云

[点击链接购买](https://www.aliyun.com/minisite/goods?userCode=pw6cig1f)