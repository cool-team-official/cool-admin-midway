/*
 Copyright © 2024-2026 Juzi Video. All rights reserved.
 版权所有 © 2024-2026 橘子视频。保留所有权利。
 作者：xiaoliwanshui
 邮箱：chocolaer@126.com


 ============================================================================
                                版权声明
 ============================================================================


 本软件（以下简称"本软件"）受中华人民共和国著作权法及国际著作权条约保护。


 【版权人】橘子视频 (Juzi Video)
 【权利范围】本软件的全部源代码、二进制文件、文档及相关材料


 ============================================================================
                                许可证协议
 ============================================================================


 本软件仅授权用户进行以下操作：


  ✓ 可免费试用：下载并运行本软件，仅限个人非商业用途
  ✓ 可学习研究：查看和学习本软件源代码，仅供个人研究


 ============================================================================
                                禁止事项
 ============================================================================


  ✗ 禁止商业使用：未经授权，不得对本软件进行销售、授权、出租或商业利用
  ✗ 禁止修改演绎：未经授权，不得对本软件进行修改、反向工程或创作衍生作品
  ✗ 禁止分发传播：未经授权，不得以任何形式向第三方分发或公开本软件
  ✗ 禁止删除版权：不得移除或篡改本软件中的任何版权声明或知识产权标识


 ============================================================================
                                免责声明
 ============================================================================


 本软件按"原样"提供，不提供任何明示或暗示的保证，包括但不限于：
 对适销性、特定用途适用性、非侵权性的保证。在任何情况下，
 版权持有人均不对因使用本软件而产生的任何索赔、损害或损失承担责任。


 ============================================================================
                                终止条款
 ============================================================================


 若您违反本协议的任何条款，本许可证将自动终止。
 终止后，您必须立即停止使用本软件，并销毁所有相关副本。


 ============================================================================
                                法律适用
 ============================================================================


 本协议受中华人民共和国法律管辖，并按其解释。


 ============================================================================
                                联系我们
 ============================================================================


 如需商业授权或其他合作事宜，请联系版权方。


 ---


 本软件受著作权法和国际条约保护。
 未经授权的复制、修改、分发或商业使用将被追究法律责任。
*/

import { CoolConfig } from '@cool-midway/core';
import { MidwayConfig } from '@midwayjs/core';
import * as path from 'path';
import { pUploadPath } from '../comm/path';
import { availablePort } from '../comm/port';

// redis缓存
import { redisStore } from 'cache-manager-ioredis-yet';

export default {
  cryptoConfig: {
    aesKey: 'e8b5a7d1c3f4a0b6e2c9d8f7a1b3c4d0e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0', // 32字节密钥的hex格式
    rsaPrivateKey: `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDMJJVMtsGFW38p
NLIPwwkV/pbl+SRF8UuIq3GCQ0V2PcedNdsPhmi9DtnyLTNSysm4XbfnAv26mCZS
RGUSBwWzw+aikqcjfmNMV3YdK24iQ7oqYLbdqkhDUlypAhSlUsQCMB4fSlklYtGA
WL8jI3EHiNdbIA3IV7wACvCEkTUiMlVUMxGV2zyx1K3j7m/2WucaW1TuA2wGZcOk
/pVIJK0fjUnr0Ac5/JqBerPyffFpfFn48wh5zc9REdeV3iLiskaDNKOnqtSVlRHL
9dqlDu6M8vkU4KzpNRp9U/ehNJIcByIX//nPMbBg+xc3vgVmlhFUx5W8wUoeaj8t
nvOfgpN/AgMBAAECggEAFEe+HUo6nMj42lsbJWhhdVyUGRylzIeq0qpViHSuaI9n
+TzpxPe8CAF7CA1oKogYKhywBwnLsxx9EhyBU0fR+oiHrQxCASCuighWT5I09Wp3
tXtjhKSaBot0G8YnzuoTVt743xrqaEW857HpVdBQ4PK955ZI8uePDGIJ1YxSFFIb
oYO+Ryu8GQBqceesgmp8M/h/MmHppSWcxWiFs59r1NQt/R/y4C10iHPsEmHeSvPg
M3Wt74M9T9FhBEXMzTkjgSopPW7MVGyFWo+WrJT15hYda/4etLaOfNa5yf6fF9ua
WFElYoq4EdsydShDM+YsjzBe/CkxUAqNEDyMvrORAQKBgQDvxNh8OWkUMBd8pt1t
6b2TlSYBJihTcMXbPOzp3Cqyh/jorUb+0aA+6oDPtV7Ckst31m/NDbu8IOYBDwHM
ihdHTkviTnNujd8/OWeqIiST1eal/zr/7T0wo+Q4QZNQz6Ud1Bceo184bZeHGFE4
aR1JPEhg/yePV+sE1LsKUgjt4QKBgQDZ9lg7feuAqOG0ASoGhzpYqp0PaGU9UfiJ
3fp6w5cEwMlgncVgRR3xJAnp3NelcruPK1nq2QUKauNnXpdNKEvooAEKByq/L62t
zhNApvJvdgnT0HY6bNiX+4TFsFncBGZVej5m9Ak0TC0hsrCTDVr8NO2VcndHmP7y
1RQNjxntXwKBgQCUMExAktcQBB0wDI3Elfd2VHNVuHiqAYQ32TLv4wR8rS8414eO
jI8G87bDKWy0wzeADIey628Bei/NrbHF8f8rMggSibwsMwEsuVUJwOpseIKCS/ny
HXV5L4IpBtZ+1qdNhTz40a5TWOCTPYNNYyIXlmuBj5GqtYLqzHQBj+w24QKBgF14
qIPyzzDgu9IfAa/FBD+MA0jdQzVV1tkA6e8Fu9jc+D9HyaIsYdfM1beF7rDUEB0o
wSnWobPC/PyScx4ynsMHAwsS4cEVqEy16Em8jpFANJyydFE/5m7e/SRuKUsSU/Rq
NSKfmubjmCMwZ0rY2mD4Lb7+VKrOsN7gg/YAnWTPAoGBAIoQH1iEIfJf/Y0P308n
HC6v9+N+Qu/QQgEoeyotH7A6u1nlMiyHzP71sMvJ4muqi1TE50vGrk0RUa3fx5yH
/g2Kgm5mjSCN+9ycY0cKtA03PO717ORgF82aDmvZdEJrHFEs6B0ZdfLPxBnOsXvc
ETTT5BZ0Z1RngEcnBrBhn452
-----END PRIVATE KEY-----
`,
    rsaPublicKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzCSVTLbBhVt/KTSyD8MJ
Ff6W5fkkRfFLiKtxgkNFdj3HnTXbD4ZovQ7Z8i0zUsrJuF235wL9upgmUkRlEgcF
s8PmopKnI35jTFd2HStuIkO6KmC23apIQ1JcqQIUpVLEAjAeH0pZJWLRgFi/IyNx
B4jXWyANyFe8AArwhJE1IjJVVDMRlds8sdSt4+5v9lrnGltU7gNsBmXDpP6VSCSt
H41J69AHOfyagXqz8n3xaXxZ+PMIec3PURHXld4i4rJGgzSjp6rUlZURy/XapQ7u
jPL5FOCs6TUafVP3oTSSHAciF//5zzGwYPsXN74FZpYRVMeVvMFKHmo/LZ7zn4KT
fwIDAQAB
-----END PUBLIC KEY-----
`,
    defaultSalt: 'a3f8c7d1b2e4a9f0c3d7e8b5a1c2d3e4',
  },
  // 确保每个项目唯一，项目首次启动会自动生成
  keys: '5581defa-0fa7-4cbe-b7b0-89f01b4fcf88',
  koa: {
    port: availablePort(8001),
  },
  // 开启异步上下文管理
  asyncContextManager: {
    enable: true,
  },
  // 静态文件配置
  staticFile: {
    buffer: true,
    dirs: {
      default: {
        prefix: '/',
        dir: path.join(__dirname, '..', '..', 'public'),
      },
      static: {
        prefix: '/upload',
        dir: pUploadPath(),
      },
      distStatic: {
        prefix: '/static',
        dir: path.join(__dirname, '..', '..', 'public', 'dist', 'static'),
      },
    },
  },
  // 文件上传
  upload: {
    fileSize: '200mb',
    whitelist: null,
  },
  // 缓存 可切换成其他缓存如：redis http://www.midwayjs.org/docs/extensions/caching
  // cacheManager: {
  //   clients: {
  //     default: {
  //       store: CoolCacheStore,
  //       options: {
  //         path: pCachePath(),
  //         ttl: 0,
  //       },
  //     },
  //   },
  // },
  redis: {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: '',
      db: 1,
    },
  },
  cacheManager: {
    clients: {
      default: {
        store: redisStore,
        options: {
          port: 6379,
          host: '127.0.0.1',
          password: '',
          ttl: 0,
          db: 0,
        },
      },
    },
  },
  // socketio 即时通讯配置
  socketIO: {
    upgrades: ['websocket'], // 可升级的协议
    cors: {
      origin: '*', // 允许所有来源，生产环境建议配置具体域名
      methods: ['GET', 'POST'],
      credentials: true,
    },
  },
  cool: {
    // 是否开启API接口文档（Swagger）
    eps: true,
    // Redis 配置（任务队列需要）
    redis: {
      host: '127.0.0.1',
      port: 6379,
      password: '',
      db: 0,
    },
    // 已经插件化，本地文件上传查看 plugin/config.ts，其他云存储查看对应插件的使用
    file: {},
    // 是否开启多租户
    tenant: {
      // 是否开启多租户
      enable: false,
      // 需要过滤多租户的url, 支持通配符， 如/admin/**/* 表示admin模块下的所有接口都进行多租户过滤
      urls: [],
    },
    // 国际化配置
    i18n: {
      // 是否开启
      enable: false,
      // 语言
      languages: ['zh-cn', 'zh-tw', 'en'],
    },
    // crud配置
    crud: {
      // 插入模式，save不会校验字段(允许传入不存在的字段)，insert会校验字段
      upsert: 'save',
      // 软删除
      softDelete: true,
    },
  } as CoolConfig,
  // 任务配置
  task: {
    // 日志保留天数
    log: {
      keepDays: 20,
    },
    // 任务执行超时时间（毫秒）
    execution: {
      timeout: 300000, // 5分钟
    },
    // 健康检查间隔时间（毫秒）
    healthCheckInterval: 600000, // 10分钟，减少日志频率
  },
} as MidwayConfig;
