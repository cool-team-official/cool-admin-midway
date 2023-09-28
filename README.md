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

- 后端：**`node.js` `midway.js` `koa.js` `mysql` `typescript`**
- 前端：**`vue.js` `element-plus` `jsx` `pinia` `vue-router`**

如果你是前端，后端的这些技术选型对你是特别友好的，前端开发者可以较快速地上手。
如果你是后端，Typescript 的语法又跟 java、php 等特别类似，一切看起来也是那么得熟悉。

<!-- 在此次添加使用文档 -->
## 演示

[AI极速编码](https://www.bilibili.com/video/BV1K84y137z1)

[https://show.cool-admin.com](https://show.cool-admin.com)

- 账户：admin
- 密码：123456

<img src="https://cool-show.oss-cn-shanghai.aliyuncs.com/admin/home-mini.png" alt="Admin Home"></a>

#### 文档

[https://cool-js.com](https://cool-js.com)

#### 项目前端

[https://github.com/cool-team-official/cool-admin-vue](https://github.com/cool-team-official/cool-admin-vue)

## 微信群

<img width="260" src="https://cool-show.oss-cn-shanghai.aliyuncs.com/admin/wechat.jpeg?v=1" alt="Admin Wechat"></a>

## 运行

#### 修改数据库配置，配置文件位于`src/config/config.local.ts`

数据库为 mysql(`>=5.7版本`)，建议 8.0，node 版本(`>=16.x`)，建议 18.x，首次启动会自动初始化并导入数据

```ts
typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: '123456',
        database: 'cool',
        // 自动建表 注意：线上部署的时候不要使用，有可能导致数据丢失
        synchronize: true,
        // 打印日志
        logging: false,
        // 字符集
        charset: 'utf8mb4',
        // 是否开启缓存
        cache: true,
        // 实体路径
        entities: ['**/modules/*/entity'],
      },
    },
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

大部分的后台管理系统，或者 API 服务都是对数据进行管理，所以可以看到大量的 CRUD 场景(增删改查)，cool-admin 对此进行了大量地封装，让这块的编码量变得极其地少。

#### 新建一个数据表

`src/modules/demo/entity/goods.ts`，项目启动数据库会自动创建该表，无需手动创建

```ts
import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, Index } from 'typeorm';

/**
 * 商品
 */
@Entity('demo_app_goods')
export class DemoAppGoodsEntity extends BaseEntity {
  @Column({ comment: '标题' })
  title: string;

  @Column({ comment: '图片' })
  pic: string;

  @Column({ comment: '价格', type: 'decimal', precision: 5, scale: 2 })
  price: number;
}
```

#### 编写 api 接口

`src/modules/demo/controller/app/goods.ts`，快速编写 6 个 api 接口

```ts
import { CoolController, BaseController } from '@cool-midway/core';
import { DemoAppGoodsEntity } from '../../entity/goods';

/**
 * 商品
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: DemoAppGoodsEntity,
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

这样我们就完成了 6 个接口的编写，对应的接口如下：

- `POST /app/demo/goods/add` 新增
- `POST /app/demo/goods/delete` 删除
- `POST /app/demo/goods/update` 更新
- `GET /app/demo/goods/info` 单个信息
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

### 低价服务器

[阿里云、腾讯云、华为云低价云服务器，不限新老](https://cool-js.com/ad/server.html)
