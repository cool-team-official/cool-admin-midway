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

import { Video_responseList } from '../bean/video_response';

export class video {
  private id: number;
  private createTime: string;
  private updateTime: string;
  private tenantId?: any;
  private createUserId?: any;
  private updateUserId?: any;
  private title: string;
  private surface_plot: string;
  private cycle: string;
  private cycle_img?: any;
  private directors?: any;
  private actors?: any;
  private imdb_score: string;
  private imdb_score_id: string;
  private douban_score: number;
  private douban_score_id: string;
  private introduce: string;
  private popularity_day: string;
  private popularity_week: string;
  private popularity_month: string;
  private popularity_sum: string;
  private note?: any;
  private status: string;
  private duration?: any;
  private number: string;
  private total: string;
  private horizontal_poster: string;
  private vertical_poster?: any;
  private publish?: any;
  private serial_number?: any;
  private screenshot?: any;
  private end: number;
  private unit?: any;
  private play_url: string;
  private play_url_put_in: number;
  private category_id: number;
  private region: number;
  private language: number;
  private collection_id: number;
  private collection_name: string;
  private remarks: string;
  private year: number;
  private category_pid: number;
  private up: number;
  private down: number;
  private popularity: string;
  private pubdate?: any;

  constructor(props: Video_responseList) {}

  public setId(id: number) {
    if (typeof id !== 'number' || isNaN(id)) return;
    this.id = id;
  }

  public getId() {
    return this.id;
  }

  public setCreateTime(createTime: string) {
    if (typeof createTime !== 'string' || createTime.trim() === '') return;
    this.createTime = createTime;
  }

  public getCreateTime() {
    return this.createTime;
  }

  public setUpdateTime(updateTime: string) {
    if (typeof updateTime !== 'string' || updateTime.trim() === '') return;
    this.updateTime = updateTime;
  }

  public getUpdateTime() {
    return this.updateTime;
  }

  public setTenantId(tenantId: any) {
    if (
      tenantId === null ||
      tenantId === undefined ||
      (typeof tenantId === 'string' && tenantId.trim() === '')
    )
      return;
    this.tenantId = tenantId;
  }

  public getTenantId() {
    return this.tenantId;
  }

  public setCreateUserId(createUserId: any) {
    if (
      createUserId === null ||
      createUserId === undefined ||
      (typeof createUserId === 'string' && createUserId.trim() === '')
    )
      return;
    this.createUserId = createUserId;
  }

  public getCreateUserId() {
    return this.createUserId;
  }

  public setUpdateUserId(updateUserId: any) {
    if (
      updateUserId === null ||
      updateUserId === undefined ||
      (typeof updateUserId === 'string' && updateUserId.trim() === '')
    )
      return;
    this.updateUserId = updateUserId;
  }

  public getUpdateUserId() {
    return this.updateUserId;
  }

  public setTitle(title: string) {
    if (typeof title !== 'string' || title.trim() === '') return;
    this.title = title;
  }

  public getTitle() {
    return this.title;
  }

  public setSurface_plot(surface_plot: string) {
    if (typeof surface_plot !== 'string' || surface_plot.trim() === '') return;
    this.surface_plot = surface_plot;
  }

  public getSurface_plot() {
    return this.surface_plot;
  }

  public setCycle(cycle: string) {
    if (typeof cycle !== 'string' || cycle.trim() === '') return;
    this.cycle = cycle;
  }

  public getCycle() {
    return this.cycle;
  }

  public setCycle_img(cycle_img: any) {
    if (
      cycle_img === null ||
      cycle_img === undefined ||
      (typeof cycle_img === 'string' && cycle_img.trim() === '')
    )
      return;
    this.cycle_img = cycle_img;
  }

  public getCycle_img() {
    return this.cycle_img;
  }

  public setDirectors(directors: any) {
    if (
      directors === null ||
      directors === undefined ||
      (typeof directors === 'string' && directors.trim() === '')
    )
      return;
    this.directors = directors;
  }

  public getDirectors() {
    return this.directors;
  }

  public setActors(actors: any) {
    if (
      actors === null ||
      actors === undefined ||
      (typeof actors === 'string' && actors.trim() === '')
    )
      return;
    this.actors = actors;
  }

  public getActors() {
    return this.actors;
  }

  public setImdb_score(imdb_score: string) {
    if (typeof imdb_score !== 'string' || imdb_score.trim() === '') return;
    this.imdb_score = imdb_score;
  }

  public getImdb_score() {
    return this.imdb_score;
  }

  public setImdb_score_id(imdb_score_id: string) {
    if (typeof imdb_score_id !== 'string' || imdb_score_id.trim() === '')
      return;
    this.imdb_score_id = imdb_score_id;
  }

  public getImdb_score_id() {
    return this.imdb_score_id;
  }

  public setDouban_score(douban_score: number) {
    if (typeof douban_score !== 'number' || isNaN(douban_score)) return;
    this.douban_score = douban_score;
  }

  public getDouban_score() {
    return this.douban_score;
  }

  public setDouban_score_id(douban_score_id: string) {
    if (typeof douban_score_id !== 'string' || douban_score_id.trim() === '')
      return;
    this.douban_score_id = douban_score_id;
  }

  public getDouban_score_id() {
    return this.douban_score_id;
  }

  public setIntroduce(introduce: string) {
    if (typeof introduce !== 'string' || introduce.trim() === '') return;
    this.introduce = introduce;
  }

  public getIntroduce() {
    return this.introduce;
  }

  public setPopularity_day(popularity_day: string) {
    if (typeof popularity_day !== 'string' || popularity_day.trim() === '')
      return;
    this.popularity_day = popularity_day;
  }

  public getPopularity_day() {
    return this.popularity_day;
  }

  public setPopularity_week(popularity_week: string) {
    if (typeof popularity_week !== 'string' || popularity_week.trim() === '')
      return;
    this.popularity_week = popularity_week;
  }

  public getPopularity_week() {
    return this.popularity_week;
  }

  public setPopularity_month(popularity_month: string) {
    if (typeof popularity_month !== 'string' || popularity_month.trim() === '')
      return;
    this.popularity_month = popularity_month;
  }

  public getPopularity_month() {
    return this.popularity_month;
  }

  public setPopularity_sum(popularity_sum: string) {
    if (typeof popularity_sum !== 'string' || popularity_sum.trim() === '')
      return;
    this.popularity_sum = popularity_sum;
  }

  public getPopularity_sum() {
    return this.popularity_sum;
  }

  public setNote(note: any) {
    if (
      note === null ||
      note === undefined ||
      (typeof note === 'string' && note.trim() === '')
    )
      return;
    this.note = note;
  }

  public getNote() {
    return this.note;
  }

  public setStatus(status: string) {
    if (typeof status !== 'string' || status.trim() === '') return;
    this.status = status;
  }

  public getStatus() {
    return this.status;
  }

  public setDuration(duration: any) {
    if (
      duration === null ||
      duration === undefined ||
      (typeof duration === 'string' && duration.trim() === '')
    )
      return;
    this.duration = duration;
  }

  public getDuration() {
    return this.duration;
  }

  public setNumber(number: string) {
    if (typeof number !== 'string' || number.trim() === '') return;
    this.number = number;
  }

  public getNumber() {
    return this.number;
  }

  public setTotal(total: string) {
    if (typeof total !== 'string' || total.trim() === '') return;
    this.total = total;
  }

  public getTotal() {
    return this.total;
  }

  public setHorizontal_poster(horizontal_poster: string) {
    if (
      typeof horizontal_poster !== 'string' ||
      horizontal_poster.trim() === ''
    )
      return;
    this.horizontal_poster = horizontal_poster;
  }

  public getHorizontal_poster() {
    return this.horizontal_poster;
  }

  public setVertical_poster(vertical_poster: any) {
    if (
      vertical_poster === null ||
      vertical_poster === undefined ||
      (typeof vertical_poster === 'string' && vertical_poster.trim() === '')
    )
      return;
    this.vertical_poster = vertical_poster;
  }

  public getVertical_poster() {
    return this.vertical_poster;
  }

  public setPublish(publish: any) {
    if (
      publish === null ||
      publish === undefined ||
      (typeof publish === 'string' && publish.trim() === '')
    )
      return;
    this.publish = publish;
  }

  public getPublish() {
    return this.publish;
  }

  public setSerial_number(serial_number: any) {
    if (
      serial_number === null ||
      serial_number === undefined ||
      (typeof serial_number === 'string' && serial_number.trim() === '')
    )
      return;
    this.serial_number = serial_number;
  }

  public getSerial_number() {
    return this.serial_number;
  }

  public setScreenshot(screenshot: any) {
    if (
      screenshot === null ||
      screenshot === undefined ||
      (typeof screenshot === 'string' && screenshot.trim() === '')
    )
      return;
    this.screenshot = screenshot;
  }

  public getScreenshot() {
    return this.screenshot;
  }

  public setEnd(end: number) {
    if (typeof end !== 'number' || isNaN(end)) return;
    this.end = end;
  }

  public getEnd() {
    return this.end;
  }

  public setUnit(unit: any) {
    if (
      unit === null ||
      unit === undefined ||
      (typeof unit === 'string' && unit.trim() === '')
    )
      return;
    this.unit = unit;
  }

  public getUnit() {
    return this.unit;
  }

  public setPlay_url(play_url: string) {
    if (typeof play_url !== 'string' || play_url.trim() === '') return;
    this.play_url = play_url;
  }

  public getPlay_url() {
    return this.play_url;
  }

  public setPlay_url_put_in(play_url_put_in: number) {
    if (typeof play_url_put_in !== 'number' || isNaN(play_url_put_in)) return;
    this.play_url_put_in = play_url_put_in;
  }

  public getPlay_url_put_in() {
    return this.play_url_put_in;
  }

  public setCategory_id(category_id: number) {
    if (typeof category_id !== 'number' || isNaN(category_id)) return;
    this.category_id = category_id;
  }

  public getCategory_id() {
    return this.category_id;
  }

  public setRegion(region: number) {
    if (typeof region !== 'number' || isNaN(region)) return;
    this.region = region;
  }

  public getRegion() {
    return this.region;
  }

  public setLanguage(language: number) {
    if (typeof language !== 'number' || isNaN(language)) return;
    this.language = language;
  }

  public getLanguage() {
    return this.language;
  }

  public setCollection_id(collection_id: number) {
    if (typeof collection_id !== 'number' || isNaN(collection_id)) return;
    this.collection_id = collection_id;
  }

  public getCollection_id() {
    return this.collection_id;
  }

  public setCollection_name(collection_name: string) {
    if (typeof collection_name !== 'string' || collection_name.trim() === '')
      return;
    this.collection_name = collection_name;
  }

  public getCollection_name() {
    return this.collection_name;
  }

  public setRemarks(remarks: string) {
    if (typeof remarks !== 'string' || remarks.trim() === '') return;
    this.remarks = remarks;
  }

  public getRemarks() {
    return this.remarks;
  }

  public setYear(year: number) {
    if (typeof year !== 'number' || isNaN(year)) return;
    this.year = year;
  }

  public getYear() {
    return this.year;
  }

  public setCategory_pid(category_pid: number) {
    if (typeof category_pid !== 'number' || isNaN(category_pid)) return;
    this.category_pid = category_pid;
  }

  public getCategory_pid() {
    return this.category_pid;
  }

  public setUp(up: number) {
    if (typeof up !== 'number' || isNaN(up)) return;
    this.up = up;
  }

  public getUp() {
    return this.up;
  }

  public setDown(down: number) {
    if (typeof down !== 'number' || isNaN(down)) return;
    this.down = down;
  }

  public getDown() {
    return this.down;
  }

  public setPopularity(popularity: string) {
    if (typeof popularity !== 'string' || popularity.trim() === '') return;
    this.popularity = popularity;
  }

  public getPopularity() {
    return this.popularity;
  }

  public setPubdate(pubdate: any) {
    if (
      pubdate === null ||
      pubdate === undefined ||
      (typeof pubdate === 'string' && pubdate.trim() === '')
    )
      return;
    this.pubdate = pubdate;
  }

  public getPubdate() {
    return this.pubdate;
  }
}
