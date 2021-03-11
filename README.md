<p align="center">
  <a href="https://midwayjs.org/" target="blank"><img src="https://cool-show.oss-cn-shanghai.aliyuncs.com/admin/logo.png" width="200" alt="Midway Logo" /></a>
</p>

<p align="center">cool-admin(midway版)一个很酷的后台权限管理系统，开源免费，模块化、插件化、极速开发CRUD，方便快速构建迭代后台管理系统，
到 <a href="https://bbs.cool-js.com" target="_blank">论坛</a> 进一步了解
<p align="center">
    <a href="https://github.com/cool-team-official/cool-admin-midway/blob/master/LICENSE" target="_blank"><img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="GitHub license" />
    <a href=""><img src="https://img.shields.io/github/package-json/v/cool-team-official/cool-admin-midway?style=flat-square" alt="GitHub tag"></a>
    <img src="https://img.shields.io/github/last-commit/cool-team-official/cool-admin-midway?style=flat-square" alt="GitHub tag"></a>
</p>

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

## QQ群
2群：539478405

## 微信群

<img width="260" src="https://cool-show.oss-cn-shanghai.aliyuncs.com/admin/wechat.jpeg" alt="Admin Wechat"></a>

## 微信公众号

<img width="260" src="https://cool-show.oss-cn-shanghai.aliyuncs.com/admin/mp.jpg" alt="Admin Wechat"></a>


## 运行

#### 修改数据库配置，配置文件位于`src/config/config.local.ts`

数据库为mysql(`>=5.7版本`)，首次启动会自动初始化并导入数据

```js
config.orm = {
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: '',
    database: 'cool-admin',
    synchronize: true,
    logging: true,
}
```

#### 安装依赖并运行

```bash
$ npm i
$ npm run dev
$ open http://localhost:8001/
```

注： 如果你的网络不佳可以尝试使用[cnpm](https://developer.aliyun.com/mirror/NPM?from=tnpm)，或者切换您的镜像源

## CURD(快速增删改查)

大部分的后台管理系统，或者API服务都是对数据进行管理，所以可以看到大量的CRUD场景(增删改查)，cool-admin对此进行了大量地封装，让这块的编码量变得极其地少。


#### 新建一个数据表

`src/modules/demo/entity/goods.ts`，项目启动数据库会自动创建该表，无需手动创建

```ts
import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from 'midwayjs-cool-core';
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
import { CoolController, BaseController } from 'midwayjs-cool-core';
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
