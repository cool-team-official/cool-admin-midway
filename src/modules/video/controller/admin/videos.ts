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

import {BaseController, CoolController} from '@cool-midway/core';
import {VideoEntity} from '../../entity/videos';
import {VideosService} from '../../service/videos';
import {Body, Inject, Post} from '@midwayjs/core';

/**
 * 商品
 */
@CoolController({
  api: ['add', 'delete', 'info', 'list', 'page', 'update'],
  entity: VideoEntity,
  service: VideosService,
  insertParam: ctx => {
    return {
      // 获得当前登录的后台用户ID，需要请求头传Authorization参数
      createUserId: ctx.admin.userId,
    };
  },
  pageQueryOp: {
    keyWordLikeFields: [
      'title',
      'sub_title',
      'directors',
      'actors',
      'video_tag',
      'video_class'
    ],
    fieldEq: [
      'category_id',
      'cycle',
      'year',
      'language',
      'region',
      'category_pid',
      'searchRecommendType',
      'play_url_put_in',
      'id'
    ],
    where: ctx => {
      const {directors, actors, video_tag} = ctx.request.body;
      //获取请求头
      const {aldult} = ctx.request.headers;
      const where = [
        [
          'directors like :directors',
          {directors: `%${directors}%`},
          directors,
        ],
        ['actors like :actors', {actors: `%${actors}%`}, actors],
        [
          'video_tag like :video_tag',
          {video_tag: `%${video_tag}%`},
          video_tag,
        ],
      ];
      if (aldult === '0') {
        where.push(['category_pid != :category_pid', {category_pid: 643}]);
      }
      return where;
    },
    addOrderBy: {
      year: 'desc',
    },
  },
})
export class AdminVideoController extends BaseController {
  @Inject()
  videosService: VideosService;

  @Post('/sort', {summary: '排序'})
  async sort(@Body() body): Promise<unknown> {
    try {
      return this.ok(await this.videosService.sort(body));
    } catch (error) {
      return this.fail(error);
    }
  }

  @Post('/week', {summary: '周数据'})
  async week(@Body() body): Promise<unknown> {
    try {
      return this.ok(await this.videosService.week(body));
    } catch (error) {
      return this.fail(error);
    }
  }

  @Post('/videoEntity', {summary: '获取视频字段信息'})
  async videoEntity(): Promise<unknown> {
    try {
      return this.ok(await this.videosService.getVideoEntityFields());
    } catch (error) {
      return this.fail(error);
    }
  }

  @Post('/updateSearchRecommendType', {summary: '批量更新推荐类型'})
  async updateSearchRecommendType(
    @Body() body: { ids: number[]; searchRecommendType: number }
  ): Promise<unknown> {
    try {
      await this.videosService.updateSearchRecommendType(
        body.ids,
        body.searchRecommendType
      );
      return this.ok();
    } catch (error) {
      return this.fail(error);
    }
  }
}
