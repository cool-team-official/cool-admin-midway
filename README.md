# cool-admin-midway

<p align="center">
  <a href="https://midwayjs.org/" target="blank"><img src="https://admin.cool-js.com/logo.png" width="200" alt="Midway Logo" /></a>
</p>

<p align="center">cool-admin 一个很酷的后台权限管理系统，开源免费，模块化、插件化、极速开发CRUD，方便快速构建迭代后台管理系统，
到 <a href="https://bbs.cool-js.com" target="_blank">论坛</a> 进一步了解
<p align="center">
    <a href="https://github.com/cool-team-official/cool-admin-midway/blob/master/LICENSE" target="_blank"><img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="GitHub license" />
    <a href=""><img src="https://img.shields.io/github/package-json/v/cool-team-official/cool-admin-midway?style=flat-square" alt="GitHub tag"></a>
    <img src="https://img.shields.io/github/last-commit/cool-team-official/cool-admin-midway?style=flat-square" alt="GitHub tag"></a>
</p>

<!-- 在此次添加使用文档 -->



## 运行

#### 修改数据库配置，配置文件位于`src/config/config.local.ts`

```js
config.orm = {
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: '',
    database: 'cool-admin',
    // 自动建表 注意：线上部署的时候不要使用，有可能导致数据丢失
    synchronize: true,
    // 打印日志
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

### 部署

```bash
$ npm start
$ npm stop
```

### 内置指令

- 使用 `npm run lint` 来做代码风格检查。
- 使用 `npm test` 来执行单元测试。


[midway]: https://midwayjs.org
