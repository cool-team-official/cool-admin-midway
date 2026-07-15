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

interface VIDEOBEAN {
  title?: string;
  sub_title?: string;
  video_tag?: string;
  video_class?: string;
  category_id?: number;
  category_pid?: number;
  surface_plot?: string;
  recommend?: number;
  cycle?: number;
  cycle_img?: string;
  charging_mode?: number;
  buy_mode?: number;
  gold?: number;
  directors?: string;
  actors?: string;
  imdb_score?: number;
  imdb_score_id?: string;
  introduce?: string;
  popularity_day?: number;
  popularity_week?: number;
  popularity_month?: number;
  popularity_sum?: number;
  note?: string;
  year?: string;
  status?: number;
  create_at?: number;
  update_at?: number;
  duration?: number;
  region?: string;
  language?: string;
  label?: string;
  number?: number;
  total?: number;
  horizontal_poster?: string;
  vertical_poster?: string;
  publish?: string;
  serial_number?: string;
  screenshot?: string;
  gif?: string;
  alias?: string;
  release_at?: number;
  shelf_at?: number;
  end?: number;
  unit?: string;
  watch?: number;
  use_local_image?: number;
  titles_time?: number;
  trailer_time?: number;
  site_id?: number;
  play_url?: string;
  play_url_put_in?: number;
  createTime?: string;
  updateTime?: string;
  createUserId?: null | number;
  updateUserId?: null | number;
  id?: number;
  douban_score_id?: null | number;
  album_id?: null | number;
  douban_score?: number;
  remarks?: string;
  vod_up?: number;
  vod_down?: number;
}

const TAG = 'VideoBean';

export class VideoBean {
  private title?: string;
  private sub_title?: string;
  private video_tag?: string;
  private video_class?: string;
  private category_id?: number;
  private category_pid?: number;
  private surface_plot?: string;
  private cycle?: number;
  private cycle_img?: string;
  private charging_mode?: number;
  private gold?: number;
  private directors?: string;
  private actors?: string;
  private imdb_score?: number;
  private imdb_score_id?: string;
  private introduce?: string;
  private popularity_day?: number;
  private popularity_week?: number;
  private popularity_month?: number;
  private popularity_sum?: number;
  private note?: string;
  private year?: number;
  private status?: number;
  private create_at?: number;
  private update_at?: number;
  private duration?: number;
  private region?: number;
  private language?: number;
  private number?: number;
  private total?: number;
  private horizontal_poster?: string;
  private vertical_poster?: string;
  private publish?: string;
  private serial_number?: string;
  private screenshot?: string;
  private end?: number;
  private unit?: string;
  private site_id?: number;
  private category_pid_status?: number;
  private category_child_id_status?: number;
  private play_url?: string;
  private play_url_put_in?: number;
  private createUserId?: null | number;
  private updateUserId?: null | number;
  private id?: number;
  private douban_score_id?: null | number;
  private douban_score?: number;
  private collection_id?: number;
  private collection_name?: string;
  private remarks?: string;
  private up?: number;
  private down?: number;
  private popularity?: number;
  private pubdate?: string;

  constructor(resources?: any) {
    try {
      this.setCategoryId(Number(resources.categoryId));
      this.setCategoryPid(Number(resources.categoryPid));
      this.setTitle(resources.vod_name || resources.name);
      this.setRemarks(resources.vod_remarks || resources.remarks);
      this.setSubTitle(resources.vod_sub);
      this.setVideoTag(resources.vod_tag || resources.tag);
      this.setVideoClass(resources.vod_class || resources.class);
      this.setSurfacePlot(
        resources.vod_surface_plot ||
          resources.surface_plot ||
          resources.pic ||
          resources.vod_pic
      );
      this.setDirectors(resources.vod_directors || resources.director);
      this.setActors(resources.vod_actors || resources.actors);
      this.setStatus(Number(resources.vod_status || resources.status));
      this.setEnd(
        Number(resources.vod_isend || resources.vod_isEnd || resources.isEnd)
      );

      this.setCollectionName(resources.collectionName);
      this.setCollectionId(resources.collectionId);
      this.setIntroduce(
        resources.vod_introduce ||
          resources.introduce ||
          resources.des ||
          resources.vod_content
      );
      this.setNumber(Number(resources.vod_number || resources.number));
      this.setDuration(Number(resources.vod_duration || resources.duration));
      this.setImdbScore(
        Number(resources.vod_imdb_score || resources.imdb_score)
      );
      this.setDoubanScore(
        Number(resources.vod_douban_score || resources.douban_score)
      );
      this.setUnit(resources.vod_unit || resources.unit);
      this.setLanguage(resources.language);
      this.setRegion(resources.area);
      this.setYear(Number(resources.vod_year || resources.year));
      this.setDoubanScoreId(Number(resources.vod_douban_id));
      this.setDoubanScore(Number(resources.vod_douban_score));
      this.setActors(resources.vod_actor);
      this.setDirectors(resources.vod_director);
      this.setPlayUrl(resources.vod_play_url || resources.play_url);
      this.setPubdate(resources.vod_pubdate || resources.pubdate);
      this.setPopularity(Number(resources.popularity || resources.vod_hits));
      this.setPopularityDay(
        Number(
          resources.vod_popularity_day ||
            resources.popularity_day ||
            resources.vod_hits_day
        )
      );
      this.setPopularityWeek(
        Number(
          resources.vod_popularity_week ||
            resources.popularity_week ||
            resources.vod_hits_week
        )
      );
      this.setPopularityMonth(
        Number(
          resources.vod_popularity_month ||
            resources.popularity_month ||
            resources.vod_hits_month
        )
      );
      this.setHorizontalPoster(
        resources.vod_pic_thumb || resources.pic || resources.vod_pic
      );
      this.setVerticalPoster(
        resources.vod_vertical_poster ||
          resources.vertical_poster ||
          resources.pic
      );
      this.setNote(resources.vod_note || resources.note);
      this.setCycle(resources.vod_cycle || resources.cycle);
      this.setTotal(
        this.extractNumber(
          resources.vod_total || resources.total || resources.note || '0'
        )
      );
      this.setPlayUrlPutIn(0);
      this.setUp(Number(resources.vod_up || resources.up));
      this.setDown(Number(resources.vod_down || resources.down));
    } catch (e) {
      console.info(TAG, e);
    }
  }

  setVideoTag(value: string) {
    if (typeof value === 'string' && value.trim() !== '') {
      // 限制video_tag字段长度不超过191字符
      if (value.length > 191) {
        this.video_tag = value.substring(0, 188) + '...';
        console.warn(TAG, `video_tag字段过长，已截断: ${value}`);
      } else {
        this.video_tag = value;
      }
    }
  }

  getVideoTag(): string {
    return this.video_tag;
  }

  setVideoClass(value: string) {
    if (typeof value === 'string' && value.trim() !== '') {
      // 限制video_class字段长度不超过191字符
      if (value.length > 191) {
        this.video_class = value.substring(0, 188) + '...';
        console.warn(TAG, `video_class字段过长，已截断: ${value}`);
      } else {
        this.video_class = value;
      }
    }
  }

  getVideoClass(): string {
    return this.video_class;
  }

  setSubTitle(value: string) {
    if (typeof value === 'string' && value.trim() !== '') {
      // 限制sub_title字段长度不超过191字符
      if (value.length > 191) {
        this.sub_title = value.substring(0, 188) + '...';
        console.warn(TAG, `sub_title字段过长，已截断: ${value}`);
      } else {
        this.sub_title = value;
      }
    }
  }

  getSubTitle(): string {
    return this.sub_title;
  }

  getPopularity(): number {
    return this.popularity;
  }

  setPopularity(value: number): void {
    if (typeof value === 'number' && !isNaN(value)) {
      this.popularity = value;
    }
  }

  getTitle(): string {
    return this.title;
  }

  setTitle(value: string): void {
    if (typeof value === 'string' && value.trim() !== '') {
      // 限制title字段长度不超过191字符
      if (value.length > 191) {
        this.title = value.substring(0, 188) + '...';
        console.warn(TAG, `title字段过长，已截断: ${value}`);
      } else {
        this.title = value;
      }
    }
  }

  setPubdate(value: string): void {
    if (typeof value === 'string' && value.trim() !== '') {
      this.pubdate = value;
    }
  }

  getPubdate(): string {
    return this.pubdate;
  }

  getCategoryId(): number {
    return this.category_id;
  }

  setCategoryId(value: number): void {
    if (typeof value === 'number' && !isNaN(value)) {
      this.category_id = value;
    }
  }

  getCategoryPid(): number {
    return this.category_pid;
  }

  setCategoryPid(value: number): void {
    if (typeof value === 'number' && !isNaN(value)) {
      this.category_pid = value;
    }
  }

  getUp(): number {
    return this.up;
  }

  setUp(value: number): void {
    if (typeof value === 'number' && !isNaN(value)) {
      this.up = value;
    }
  }

  getDown(): number {
    return this.down;
  }

  setDown(value: number): void {
    if (typeof value === 'number' && !isNaN(value)) {
      this.down = value;
    }
  }

  //remarks
  getRemarks(): string {
    return this.remarks;
  }

  setRemarks(value: string): void {
    if (typeof value === 'string' && value.trim() !== '') {
      this.remarks = value;
    }
  }

  getSurfacePlot(): string {
    return this.surface_plot;
  }

  setSurfacePlot(value: string): void {
    if (typeof value === 'string' && value.trim() !== '') {
      this.surface_plot = value;
    }
  }

  getCycle(): number {
    return this.cycle;
  }

  setCycle(value: number): void {
    if (typeof value === 'number' && !isNaN(value)) {
      this.cycle = value;
    }
  }

  getDirectors(): string {
    return this.directors;
  }

  setDirectors(value: string): void {
    if (typeof value === 'string' && value.trim() !== '') {
      // directors字段是text类型，但为了防止数据过大，限制在500字符内
      if (value.length > 500) {
        this.directors = value.substring(0, 497) + '...';
        console.warn(TAG, 'directors字段过长，已截断');
      } else {
        this.directors = value;
      }
    }
  }

  getActors(): string {
    return this.actors;
  }

  setActors(value: string): void {
    if (typeof value === 'string' && value.trim() !== '') {
      // actors字段是text类型，但为了防止数据过大，限制在500字符内
      if (value.length > 500) {
        this.actors = value.substring(0, 497) + '...';
        console.warn(TAG, 'actors字段过长，已截断');
      } else {
        this.actors = value;
      }
    }
  }

  getImdbScore(): number {
    return this.imdb_score;
  }

  setImdbScore(value: number): void {
    if (typeof value === 'number' && !isNaN(value)) {
      this.imdb_score = value;
    }
  }

  getImdbScoreId(): string {
    return this.imdb_score_id;
  }

  setImdbScoreId(value: string): void {
    if (typeof value === 'string' && value.trim() !== '') {
      this.imdb_score_id = value;
    }
  }

  getIntroduce(): string {
    return this.introduce;
  }

  setIntroduce(value: string): void {
    if (typeof value === 'string' && value.trim() !== '') {
      this.introduce = value;
    }
  }

  //collection_name
  getCollectionName(): string {
    return this.collection_name;
  }

  setCollectionName(value: string): void {
    if (typeof value === 'string' && value.trim() !== '') {
      // 限制collection_name字段长度不超过256字符
      if (value.length > 256) {
        this.collection_name = value.substring(0, 253) + '...';
        console.warn(TAG, `collection_name字段过长，已截断: ${value}`);
      } else {
        this.collection_name = value;
      }
    }
  }

  getPopularityDay(): number {
    return this.popularity_day;
  }

  setPopularityDay(value: number): void {
    if (typeof value === 'number' && !isNaN(value)) {
      this.popularity_day = value;
    }
  }

  getPopularityWeek(): number {
    return this.popularity_week;
  }

  setPopularityWeek(value: number): void {
    if (typeof value === 'number' && !isNaN(value)) {
      this.popularity_week = value;
    }
  }

  getPopularityMonth(): number {
    return this.popularity_month;
  }

  setPopularityMonth(value: number): void {
    if (typeof value === 'number' && !isNaN(value)) {
      this.popularity_month = value;
    }
  }

  getPopularitySum(): number {
    return this.popularity_sum;
  }

  setPopularitySum(value: number): void {
    if (typeof value === 'number' && !isNaN(value)) {
      this.popularity_sum = value;
    }
  }

  getNote(): string {
    return this.note;
  }

  setNote(value: string): void {
    if (typeof value === 'string' && value.trim() !== '') {
      // note字段有256字符限制
      if (value.length > 256) {
        this.note = value.substring(0, 253) + '...';
        console.warn(TAG, `note字段过长，已截断: ${value}`);
      } else {
        this.note = value;
      }
    }
  }

  getYear(): number {
    return this.year;
  }

  setYear(value: number): void {
    if (typeof value === 'number' && !isNaN(value)) {
      this.year = value;
    }
  }

  getStatus(): number {
    return this.status;
  }

  setStatus(value: number): void {
    if (typeof value === 'number' && !isNaN(value)) {
      this.status = value;
    }
  }

  getDuration(): number {
    return this.duration;
  }

  setDuration(value: number): void {
    if (typeof value === 'number' && !isNaN(value)) {
      this.duration = value;
    }
  }

  getRegion(): number {
    return this.region;
  }

  setRegion(value: number): void {
    if (typeof value === 'number') {
      this.region = value;
    }
  }

  getLanguage(): number {
    return this.language;
  }

  setLanguage(value: number): void {
    if (typeof value === 'number') {
      this.language = value;
    }
  }

  getNumber(): number {
    return this.number;
  }

  setNumber(value: number): void {
    if (typeof value === 'number' && !isNaN(value)) {
      this.number = value;
    }
  }

  getTotal(): number {
    return this.total;
  }

  setTotal(value: number): void {
    if (typeof value === 'number' && !isNaN(value)) {
      this.total = value;
    }
  }

  getHorizontalPoster(): string {
    return this.horizontal_poster;
  }

  setHorizontalPoster(value: string): void {
    if (typeof value === 'string' && value.trim() !== '') {
      this.horizontal_poster = value;
    }
  }

  getVerticalPoster(): string {
    return this.vertical_poster;
  }

  setVerticalPoster(value: string): void {
    if (typeof value === 'string' && value.trim() !== '') {
      this.vertical_poster = value;
    }
  }

  getScreenshot(): string {
    return this.screenshot;
  }

  setScreenshot(value: string): void {
    if (typeof value === 'string' && value.trim() !== '') {
      this.screenshot = value;
    }
  }

  getEnd(): number {
    return this.end;
  }

  setEnd(value: number): void {
    if (typeof value === 'number' && !isNaN(value)) {
      this.end = value;
    }
  }

  getUnit(): string {
    return this.unit;
  }

  setUnit(value: string): void {
    if (typeof value === 'string' && value.trim() !== '') {
      // unit字段有32字符限制
      if (value.length > 32) {
        this.unit = value.substring(0, 29) + '...';
        console.warn(TAG, `unit字段过长，已截断: ${value}`);
      } else {
        this.unit = value;
      }
    }
  }

  //collection_id
  getCollectionId(): number {
    return this.collection_id;
  }

  setCollectionId(value: number): void {
    if (typeof value === 'number' && !isNaN(value)) {
      this.collection_id = value;
    }
  }

  getPlayUrl(): string {
    return this.play_url;
  }

  setPlayUrl(value: string): void {
    if (typeof value === 'string' && value.trim() !== '') {
      this.play_url = value;
    }
  }

  getPlayUrlPutIn(): number {
    return this.play_url_put_in;
  }

  setPlayUrlPutIn(value: number): void {
    if (typeof value === 'number' && !isNaN(value)) {
      this.play_url_put_in = value;
    }
  }

  getCreateUserId(): null | number {
    return this.createUserId;
  }

  setCreateUserId(value: null | number): void {
    if (value === null || typeof value === 'number') {
      this.createUserId = value;
    }
  }

  getUpdateUserId(): null | number {
    return this.updateUserId;
  }

  setUpdateUserId(value: null | number): void {
    if (value === null || typeof value === 'number') {
      this.updateUserId = value;
    }
  }

  getDoubanScoreId(): null | number {
    return this.douban_score_id;
  }

  setDoubanScoreId(value: null | number): void {
    if (value === null || (typeof value === 'number' && !isNaN(value))) {
      this.douban_score_id = value;
    }
  }

  getDoubanScore(): number {
    return this.douban_score;
  }

  setDoubanScore(value: number): void {
    if (typeof value === 'number' && !isNaN(value)) {
      this.douban_score = value;
    }
  }

  //实现一个提取字符串中数字的函数
  extractNumber(inputString: string): number {
    //判断inputString是不是一个number 如果是number类型就直接返回
    if (!isNaN(Number(inputString))) {
      return Number(inputString);
    }
    // 使用正则表达式匹配数字
    const regex = /\d+/g;
    const matches = inputString.match(regex);

    // 如果匹配到数字，返回第一个匹配的数字
    if (matches && matches.length > 0) {
      return parseInt(matches[0]);
    }

    // 如果没有匹配到数字，返回 NaN
    return NaN;
  }

  /**
   * 获取视频信息
   * @returns 返回视频信息的字符串表示
   */
  getVideoInfo(): string {
    return `Title: ${this.title}, Year: ${this.year}, Directors: ${this.directors}, Actors: ${this.actors}, Introduce: ${this.introduce}`;
  }
}
