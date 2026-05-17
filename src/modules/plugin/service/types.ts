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

import { BaseService } from '@cool-midway/core';
import { App, IMidwayApplication, Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import * as ts from 'typescript';
import { Utils } from '../../../comm/utils';
import { PluginInfoEntity } from '../entity/info';
import { PluginService } from './info';

/**
 * 插件类型服务
 */
@Provide()
export class PluginTypesService extends BaseService {
  @App()
  app: IMidwayApplication;

  @InjectEntityModel(PluginInfoEntity)
  pluginInfoEntity: Repository<PluginInfoEntity>;

  @Inject()
  pluginService: PluginService;

  @Inject()
  utils: Utils;

  /**
   * 生成d.ts文件
   * @param tsContent
   * @returns
   */
  async dtsContent(tsContent: string) {
    let output = '';

    const compilerHost: ts.CompilerHost = {
      fileExists: ts.sys.fileExists,
      getCanonicalFileName: ts.sys.useCaseSensitiveFileNames
        ? s => s
        : s => s.toLowerCase(),
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getDefaultLibFileName: options => ts.getDefaultLibFilePath(options),
      getDirectories: ts.sys.getDirectories,
      getNewLine: () => ts.sys.newLine,
      getSourceFile: (fileName, languageVersion) => {
        if (fileName === 'file.ts') {
          return ts.createSourceFile(
            fileName,
            tsContent,
            languageVersion,
            true
          );
        }
        const filePath = ts.sys.resolvePath(fileName);
        return ts.sys.readFile(filePath)
          ? ts.createSourceFile(
              filePath,
              ts.sys.readFile(filePath)!,
              languageVersion,
              true
            )
          : undefined;
      },
      readFile: ts.sys.readFile,
      useCaseSensitiveFileNames: () => ts.sys.useCaseSensitiveFileNames,
      writeFile: (fileName, content) => {
        if (fileName.includes('file.d.ts')) {
          output = content || output;
        }
      },
    };

    const options: ts.CompilerOptions = {
      declaration: true,
      emitDeclarationOnly: true,
      outDir: './',
      skipLibCheck: true,
      skipDefaultLibCheck: true,
      noEmitOnError: false,
      target: ts.ScriptTarget.ES2018,
      strict: false,
      module: ts.ModuleKind.Node16,
      moduleResolution: ts.ModuleResolutionKind.Node16,
      types: ['node'],
    };

    const program = ts.createProgram(['file.ts'], options, compilerHost);
    program.emit();

    if (!output) {
      // Provide a default value if the output is still empty
      output = '/* No declaration content generated */';
    }
    return output;
  }

  /**
   * 生成d.ts文件
   * @param key
   * @param tsContent
   * @returns
   */
  async generateDtsFile(key: string, tsContent: string) {
    const env = this.app.getEnv();
    // 不是本地开发环境不生成d.ts文件
    if (env != 'local' || !tsContent) {
      return;
    }
    // 基础路径
    const basePath = path.join(this.app.getBaseDir(), '..', 'typings');
    // pluginDts文件路径
    const pluginDtsPath = path.join(basePath, 'plugin.d.ts');
    // plugin文件夹路径
    const pluginPath = path.join(basePath, `${key}.d.ts`);
    // 生成d.ts文件
    const dtsContent = await this.dtsContent(tsContent);

    // 读取plugin.d.ts文件内容
    let pluginDtsContent = fs.readFileSync(pluginDtsPath, 'utf-8');

    // 根据key判断是否在PluginMap中存在
    const keyWithHyphen = key.includes('-');
    const importStatement = keyWithHyphen
      ? `import * as ${key.replace(/-/g, '_')} from './${key}';`
      : `import * as ${key} from './${key}';`;
    const pluginMapEntry = keyWithHyphen
      ? `'${key}': ${key.replace(/-/g, '_')}.CoolPlugin;`
      : `${key}: ${key}.CoolPlugin;`;

    // 检查import语句是否已经存在，若不存在则添加
    if (!pluginDtsContent.includes(importStatement)) {
      pluginDtsContent = `${importStatement}\n${pluginDtsContent}`;
    }

    // 检查PluginMap中的键是否存在，若不存在则添加
    if (pluginDtsContent.includes(pluginMapEntry)) {
      // 键存在则覆盖
      const regex = new RegExp(
        `(\\s*${keyWithHyphen ? `'${key}'` : key}:\\s*[^;]+;)`
      );
      pluginDtsContent = pluginDtsContent.replace(regex, pluginMapEntry);
    } else {
      // 键不存在则追加
      const pluginMapRegex = /interface\s+PluginMap\s*{([^}]*)}/;
      pluginDtsContent = pluginDtsContent.replace(
        pluginMapRegex,
        (match, p1) => {
          return match.replace(p1, `${p1.trim()}\n  ${pluginMapEntry}`);
        }
      );
    }

    // 格式化内容
    pluginDtsContent = await this.formatContent(pluginDtsContent);

    // 延迟2秒写入文件
    setTimeout(async () => {
      // 写入d.ts文件，如果存在则覆盖
      fs.writeFile(pluginPath, await this.formatContent(dtsContent), () => {});

      // 写入plugin.d.ts文件
      fs.writeFile(pluginDtsPath, pluginDtsContent, () => {});
    }, 2000);
  }

  /**
   * 删除d.ts文件中的指定key
   * @param key
   */
  async deleteDtsFile(key: string) {
    const env = this.app.getEnv();
    // 不是本地开发环境不删除d.ts文件
    if (env != 'local') {
      return;
    }
    // 基础路径
    const basePath = path.join(this.app.getBaseDir(), '..', 'typings');
    // pluginDts文件路径
    const pluginDtsPath = path.join(basePath, 'plugin.d.ts');
    // plugin文件夹路径
    const pluginPath = path.join(basePath, `${key}.d.ts`);

    // 读取plugin.d.ts文件内容
    let pluginDtsContent = fs.readFileSync(pluginDtsPath, 'utf-8');

    // 根据key判断是否在PluginMap中存在
    const keyWithHyphen = key.includes('-');
    const importStatement = keyWithHyphen
      ? `import \\* as ${key.replace(/-/g, '_')} from '\\./${key}';`
      : `import \\* as ${key} from '\\./${key}';`;
    const pluginMapEntry = keyWithHyphen
      ? `'${key}': ${key.replace(/-/g, '_')}.CoolPlugin;`
      : `${key}: ${key}.CoolPlugin;`;

    // 删除import语句
    const importRegex = new RegExp(`${importStatement}\\n`, 'g');
    pluginDtsContent = pluginDtsContent.replace(importRegex, '');

    // 删除PluginMap中的键
    const pluginMapRegex = new RegExp(`\\s*${pluginMapEntry}`, 'g');
    pluginDtsContent = pluginDtsContent.replace(pluginMapRegex, '');

    // 格式化内容
    pluginDtsContent = await this.formatContent(pluginDtsContent);

    // 延迟2秒写入文件
    setTimeout(async () => {
      // 删除插件d.ts文件
      if (fs.existsSync(pluginPath)) {
        fs.unlink(pluginPath, () => {});
      }
      // 写入plugin.d.ts文件
      fs.writeFile(pluginDtsPath, pluginDtsContent, () => {});
    }, 2000);
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

  /**
   * 重新生成d.ts文件
   */
  async reGenerate() {
    const pluginInfos = await this.pluginInfoEntity
      .createQueryBuilder('a')
      .where('a.status = :status', { status: 1 })
      .select(['a.id', 'a.status', 'a.tsContent', 'a.keyName'])
      .getMany();
    for (const pluginInfo of pluginInfos) {
      const data = await this.pluginService.getData(pluginInfo.keyName);
      if (!data) {
        continue;
      }
      const tsContent = data.tsContent?.data;
      if (tsContent) {
        await this.generateDtsFile(pluginInfo.keyName, tsContent);
        await this.utils.sleep(200);
      }
    }
  }
}
