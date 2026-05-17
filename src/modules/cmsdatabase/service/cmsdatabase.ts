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

import { Provide, Inject, Scope, ScopeEnum } from '@midwayjs/core';

import { Repository, DataSource } from 'typeorm';
import { CMSDatabaseSqlLogEntity } from '../entity/cmssqlLog';
import * as _ from 'lodash';
import * as crypto from 'crypto';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { BaseService } from '../../base/service/base';
import { CoolCommException } from '@cool-midway/core';
import { BaseSysLoginService } from '../../base/service/sys/login';

/**
 * 数据库服务
 */
@Provide()
export class CMSDatabaseService extends BaseService {
  @Inject()
  ctx;

  @Inject()
  baseSysLoginService: BaseSysLoginService;

  @InjectEntityModel(CMSDatabaseSqlLogEntity)
  databaseSqlLogEntity: Repository<CMSDatabaseSqlLogEntity>;

  /**
   * 获取 SQL 类型
   */
  getSqlType(sql: string): string {
    const trimmed = sql.trim().toUpperCase();
    const sqlTypes = [
      'SELECT',
      'INSERT',
      'UPDATE',
      'DELETE',
      'CREATE',
      'DROP',
      'ALTER',
      'TRUNCATE',
      'REPLACE',
    ];

    for (const type of sqlTypes) {
      if (trimmed.startsWith(type)) {
        return type;
      }
    }

    return 'UNKNOWN';
  }

  /**
   * 获取警告信息
   */
  getWarning(sqlType: string): string {
    const warnings: Record<string, string> = {
      DROP: '⚠️ 危险操作：DROP 语句会永久删除数据库对象',
      TRUNCATE: '⚠️ 危险操作：TRUNCATE 会清空整个表数据',
      DELETE: '⚠️ 注意：DELETE 操作会删除数据，请确保有 WHERE 条件',
      UPDATE: '⚠️ 注意：UPDATE 操作会修改数据，请确保有 WHERE 条件',
      ALTER: '⚠️ 注意：ALTER 会修改表结构',
      CREATE: 'ℹ️ 提示：CREATE 会创建新的数据库对象',
      REPLACE: '⚠️ 注意：REPLACE 会替换现有数据',
    };

    return warnings[sqlType] || '';
  }

  /**
   * 执行 SQL
   */
  async execute(sql: string, captchaId: string, verifyCode: string) {
    // 验证验证码
    const check = await this.baseSysLoginService.captchaCheck(
      captchaId,
      verifyCode
    );
    if (!check) {
      throw new CoolCommException('图片验证码错误');
    }

    const startTime = Date.now();
    const sqlType = this.getSqlType(sql);

    try {
      // 执行 SQL
      const result = await this.nativeQuery(sql);

      const endTime = Date.now();
      const executionTime = endTime - startTime;
      const warning = this.getWarning(sqlType);
      const affectedRows = result?.changedRows || 0;

      // 记录日志
      await this.logExecution(
        sql,
        sqlType,
        executionTime,
        this.ctx.admin?.userId,
        true,
        undefined,
        affectedRows,
        warning
      );

      return {
        data: result || [],
        affectedRows,
        time: executionTime,
        sqlType,
        warning,
      };
    } catch (error: any) {
      const endTime = Date.now();

      // 记录错误日志
      await this.logExecution(
        sql,
        this.getSqlType(sql),
        endTime - startTime,
        this.ctx.admin?.userId,
        false,
        error.message,
        0,
        undefined
      );

      throw new Error(`SQL 执行失败：${error.message}`);
    } finally {
    }
  }

  /**
   * 记录执行日志
   */
  private async logExecution(
    sql: string,
    sqlType: string,
    time: number,
    userId?: number,
    success?: boolean,
    error?: string,
    affectedRows?: number,
    warning?: string
  ) {
    try {
      // 使用 entityManager 保存日志
      await this.databaseSqlLogEntity.insert({
        sql,
        sqlType,
        status: success ? 1 : 0,
        affectedRows: affectedRows || 0,
        error: error || null,
        warning: warning || null,
        createUserId: this.ctx.admin?.userId,
        executionTime: time,
      });
    } catch (e) {
      // 日志记录失败不影响主流程
      console.error('记录 SQL 日志失败:', e);
    }
  }
}
