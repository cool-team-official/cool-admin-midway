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

export interface VIDEOPARAMS {
  srid?: number;
  ac?: string;
  h?: number;
  ids?: string;
  limit?: number;
  op?: string;
  page?: number;
  pagesize?: number;
  pg?: number;
  ps?: number;
  t?: number;
  wd?: string;
}

export class VideoParams {
  private total = 0;
  private srid = 0;
  private ac = 'videolist';
  private h = undefined;
  private ids = '';
  private limit = 0;
  private op = 'all';
  private page = 1;
  private pagesize = 0;
  private pg = 1;
  private ps = 0;
  private t = 0;
  private wd = '';
  private pagecount = 0;

  constructor({
    total = 0,
    srid = 0,
    ac = 'videolist',
    h = undefined,
    ids = '',
    limit = 0,
    op = 'all',
    page = 1,
    pagesize = 0,
    pg = 1,
    ps = 0,
    t = 0,
    wd = '',
  }) {
    this.total = total;
    this.srid = srid;
    this.ac = ac;
    this.h = h;
    this.ids = ids;
    this.limit = limit;
    this.op = op;
    this.page = page;
    this.pagesize = pagesize;
    this.pg = pg;
    this.ps = ps;
    this.t = t;
    this.wd = wd;
  }

  getSrid(): number {
    return this.srid;
  }

  setSrid(value: number): void {
    this.srid = value;
  }

  getAc(): string {
    return this.ac;
  }

  setAc(value: string): void {
    this.ac = value;
  }

  getH(): number {
    return this.h;
  }

  setH(value: number): void {
    this.h = value;
  }

  getIds(): string {
    return this.ids;
  }

  setIds(value: string): void {
    this.ids = value;
  }

  getLimit(): number {
    return this.limit;
  }

  setLimit(value: number): void {
    this.limit = value;
  }

  getOp(): string {
    return this.op;
  }

  setOp(value: string): void {
    this.op = value;
  }

  getPage(): number {
    return this.page;
  }

  setPage(value: number): void {
    this.page = value;
  }

  getPagesize(): number {
    return this.pagesize;
  }

  setPagesize(value: number): void {
    this.pagesize = value;
  }

  getPg(): number {
    return this.pg;
  }

  setPg(value: number): void {
    this.pg = value;
  }

  getPs(): number {
    return this.ps;
  }

  setPs(value: number): void {
    this.ps = value;
  }

  getT(): number {
    return this.t;
  }

  setT(value: number): void {
    this.t = value;
  }

  getWd(): string {
    return this.wd;
  }

  setWd(value: string): void {
    this.wd = value;
  }

  setTotal(total: number) {
    this.total = total;
  }

  getTotal(): number {
    return this.total;
  }

  setPagecount(pagecount: number) {
    this.pagecount = pagecount;
  }

  getPagecount(): number {
    return this.pagecount;
  }

  getObject(): VIDEOPARAMS {
    return {
      srid: this.srid,
      ac: this.ac,
      h: this.h,
      ids: this.ids,
      limit: this.limit,
      op: this.op,
      page: this.page,
      pagesize: this.pagesize,
      pg: this.pg,
      ps: this.ps,
      t: this.t,
      wd: this.wd,
    };
  }

  /**
   * 获取视频列表查询字符串
   * @returns 返回查询字符串
   */
  getQueryString(): string {
    return `&rid=${this.srid}&ac=${this.ac}&h=${this.h}&ids=${this.ids}&limit=${this.limit}&op=${this.op}&page=${this.page}&pagesize=${this.pagesize}&pg=${this.pg}&ps=${this.ps}&t=${this.t}&wd=${this.wd}`;
  }
}
