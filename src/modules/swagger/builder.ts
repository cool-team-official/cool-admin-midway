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

import { CoolEps } from '@cool-midway/core';
import { Config, Inject, Provide, Scope, ScopeEnum } from '@midwayjs/core';
import * as _ from 'lodash';

/**
 * 构建文档
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class SwaggerBuilder {
  @Config('module.swagger.base')
  swaggerBase;

  @Inject()
  eps: CoolEps;

  json = {};

  @Config('cool.eps')
  epsConfig: boolean;

  /**
   * 初始化
   */
  async init() {
    if (this.epsConfig) {
      this.build();
    }
  }

  /**
   * 构建文档
   */
  async build() {
    const epsData = {
      app: this.eps.app || [],
      admin: this.eps.admin || [],
      module: this.eps.module || {},
    };
    this.json = this.convertToSwagger(epsData);
  }

  /**
   * Epss转换为Swagger
   * @param dataJson
   * @returns
   */
  convertToSwagger(dataJson) {
    const swagger = {
      ...this.swaggerBase,
      paths: {},
      tags: Object.keys(dataJson.module)
        .filter(item => item != 'swagger')
        .map(moduleKey => {
          return {
            key: moduleKey,
            name: dataJson.module[moduleKey].name || '',
            description: dataJson.module[moduleKey].description || '',
          };
        }),
    };
    // 添加组件
    function addComponentSchemas(data) {
      if (_.isEmpty(data.name)) return;
      const schema = {
        type: 'object',
        properties: {},
        required: [],
      };

      data.columns.forEach(column => {
        const swaggerType = mapTypeToSwagger(column.type);
        schema.properties[column.propertyName] = {
          type: swaggerType,
          description: column.comment,
        };

        if (!column.nullable) {
          schema.required.push(column.propertyName);
        }
      });

      swagger.components.schemas[data.name] = schema;
      return data.name;
    }
    // 转换类型
    function mapTypeToSwagger(type) {
      const typeMapping = {
        string: 'string',
        number: 'number',
        bigint: 'integer',
        datetime: 'string', // assuming datetime is formatted as ISO8601 string
      };
      return typeMapping[type] || 'string';
    }
    // 添加请求体
    function addRequest(path, schemas, data) {
      if (path == '/info' || path == '/list' || path == '/page') {
        if (path == '/info') {
          data.parameters = [
            {
              name: 'id',
              in: 'query',
              description: 'ID',
              required: true,
              schema: {
                type: 'integer',
              },
            },
          ];
        } else {
          data.requestBody = {
            description: '动态请求体',
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties:
                    path == '/page'
                      ? {
                          page: {
                            type: 'integer',
                            description: '第几页',
                            default: 1,
                          },
                          size: {
                            type: 'integer',
                            description: '每页大小',
                            default: 20,
                          },
                        }
                      : {},
                },
              },
            },
          };
        }
        data.responses = {
          '200': {
            description: '成功响应',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    code: {
                      type: 'integer',
                      description: '状态码',
                    },
                    message: {
                      type: 'string',
                      description: '响应消息',
                    },
                    data: {
                      $ref: `#/components/schemas/${schemas}`,
                    },
                  },
                },
              },
            },
          },
        };
      }
      if (path == '/add' || path == '/update') {
        data.requestBody = {
          description: schemas,
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: `#/components/schemas/${schemas}`,
              },
            },
          },
        };
        data.responses = {
          '200': {
            description: '成功响应',
            content: {
              'application/json': {
                example: {
                  code: 1000,
                  message: 'success',
                  data: {
                    id: 6,
                  },
                },
              },
            },
          },
        };
      }
      if (path == '/delete') {
        data.requestBody = {
          description: schemas,
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ids: {
                    type: 'array',
                    description: 'ID数组',
                    items: {
                      type: 'integer',
                    },
                  },
                },
              },
            },
          },
        };
        data.responses = {
          '200': {
            description: '成功响应',
            content: {
              'application/json': {
                example: {
                  code: 1000,
                  message: 'success',
                },
              },
            },
          },
        };
      }
    }
    // 处理每个模块下的API接口
    function processModuleApis(moduleApis, moduleName) {
      moduleApis.forEach(module => {
        const schemas = addComponentSchemas({
          name: module.name,
          columns: module.columns,
        });
        if (Array.isArray(module.api)) {
          module.api.forEach(api => {
            const fullPath = `${api.prefix == '/' ? '' : api.prefix}${
              api.path
            }`;
            const method = api.method.toLowerCase();

            if (!swagger.paths[fullPath]) {
              swagger.paths[fullPath] = {};
            }

            swagger.paths[fullPath][method] = {
              summary:
                `【${module.info.type.description || module.info.type.name}】` +
                  api.summary || '',
              security: api.ignoreToken
                ? []
                : [
                    {
                      ApiKeyAuth: [],
                    },
                  ],
              tags: [moduleName || '其他'],
              requestBody:
                method == 'post'
                  ? {
                      description: '请求体',
                      required: true,
                      content: {
                        'application/json': {
                          schema: {
                            type: 'object',
                            properties: {},
                          },
                        },
                      },
                    }
                  : {},
              responses: schemas
                ? {
                    '200': {
                      description: 'Success response',
                      content: {
                        'application/json': {
                          schema: {
                            $ref: `#/components/schemas/${schemas}`,
                          },
                        },
                      },
                    },
                  }
                : {},
            };
            addRequest(api.path, schemas, swagger.paths[fullPath][method]);
          });
        }
      });
    }

    // 遍历app和admin中的所有模块
    Object.keys(dataJson.app).forEach(moduleKey => {
      if (Array.isArray(dataJson.app[moduleKey])) {
        processModuleApis(
          dataJson.app[moduleKey],
          dataJson.module[moduleKey]?.name
        );
      }
    });
    Object.keys(dataJson.admin).forEach(moduleKey => {
      if (Array.isArray(dataJson.admin[moduleKey])) {
        processModuleApis(
          dataJson.admin[moduleKey],
          dataJson.module[moduleKey]?.name
        );
      }
    });

    return swagger;
  }
}
