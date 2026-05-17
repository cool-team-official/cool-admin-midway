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

import { App, IMidwayApplication, Init, Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Ai编码
 */
@Provide()
export class BaseCodingService extends BaseService {
  @App()
  app: IMidwayApplication;

  /**
   * 获得模块目录结构
   */
  async getModuleTree() {
    if (this.app.getEnv() !== 'local') {
      return [];
    }

    const moduleDir = await this.app.getBaseDir();
    const modulesPath = path.join(moduleDir, 'modules');
    // 返回modules下有多少个模块
    const modules = fs.readdirSync(modulesPath);
    return modules.filter(module => module !== '.DS_Store');
  }

  /**
   * 创建代码
   * @param codes 代码
   */
  async createCode(
    codes: {
      path: string;
      content: string;
    }[]
  ) {
    if (this.app.getEnv() !== 'local') {
      throw new Error('只能在开发环境下创建代码');
    }

    const moduleDir = this.app.getAppDir();

    for (const code of codes) {
      // 格式化代码内容
      const formattedContent = await this.formatContent(code.content);

      // 获取完整的文件路径
      const filePath = path.join(moduleDir, code.path);

      // 确保目录存在
      const dirPath = path.dirname(filePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // 写入文件
      fs.writeFileSync(filePath, formattedContent, 'utf8');
    }
  }

  /**
   * 格式化内容
   * @param content
   */
  async formatContent(content: string) {
    // 使用prettier格式化内容
    const prettier = require('prettier');
    return prettier.format(content, {
      parser: 'typescript',
      singleQuote: true,
      trailingComma: 'all',
      bracketSpacing: true,
      arrowParens: 'avoid',
      printWidth: 80,
    });
  }
}
