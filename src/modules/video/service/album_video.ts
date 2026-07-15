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

import { ILogger, Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { VideoEntity } from '../entity/videos';
import { In, Repository } from 'typeorm';
import { VideoAlbumRelationship } from '../entity/video_album_relationship';
import { VideoAlbumEntity } from '../entity/album';
import { AlbumQueryDTO } from '../dto/album';
import { AlbumResponse, AlbumVideoInfo } from '../dto/album_response';

const TAG = 'AlbumVideoServer';

@Provide()
export class AlbumVideoServer {
  @InjectEntityModel(VideoEntity)
  videoEntity: Repository<VideoEntity>;

  @InjectEntityModel(VideoAlbumRelationship)
  videoAlbumRelationship: Repository<VideoAlbumRelationship>;

  @InjectEntityModel(VideoAlbumEntity)
  albumEntity: Repository<VideoAlbumEntity>;

  @Inject()
  logger: ILogger;

  //批量添加专辑内容
  async insertAlbumVideo(id: number, title: [string]): Promise<any> {
    const list = await this.videoEntity.findBy({ title: In(title) });
    return await this.videoAlbumRelationship.save(
      list.map(item => {
        return {
          album_id: id,
          videos_id: item.id,
        };
      })
    );
  }

  async album(query: AlbumQueryDTO): Promise<AlbumResponse> {
    let { list } = await this.videoAlbumEntityPage(query);
    const pagination = this.setPageDefault(query);
    return {
      list,
      pagination: {
        page: pagination.page || 1,
        size: pagination.size || 10,
        videoSize: pagination.videoSize || 4,
        videoPage: pagination.videoPage || 1,
      },
    };
  }

  setPageDefault(query: AlbumQueryDTO): AlbumQueryDTO {
    query.page = query.page ? query.page : 1;
    query.size = query.size ? query.size : 10;
    query.videoSize = query.videoSize ? query.videoSize : 4;
    query.videoPage = query.videoPage ? query.videoPage : 1;
    return query;
  }

  //查询albumEntity分页
  async videoAlbumEntityPage(
    query: AlbumQueryDTO
  ): Promise<{ list: AlbumVideoInfo[] }> {
    //给分页设置默认值
    query = this.setPageDefault(query);
    const data: VideoAlbumEntity[] = await this.albumEntity.find({
      where: {
        category_id:
          query.category_id instanceof Array
            ? In(query.category_id)
            : query.category_id,
      },
      order: {
        sort: 'DESC',
      },
      skip: (query.page - 1) * query.size,
      take: query.size,
    });
    if (!data.length) {
      return { list: [] };
    }
    return this.videoAlbumRelationshipPage(data, query);
  }

  async videoAlbumRelationshipPage(
    data: VideoAlbumEntity[],
    query: AlbumQueryDTO
  ): Promise<{
    list: AlbumVideoInfo[];
  }> {
    if (!data.length) {
      return { list: [] };
    }

    // 提取所有专辑ID
    const albumIds = data.map(item => item.id);

    // 一次性查询所有专辑的视频关系
    const allRelationships = await this.videoAlbumRelationship.find({
      where: { album_id: In(albumIds) },
      order: { sort: 'DESC' },
    });

    // 按专辑ID分组
    const relationshipsByAlbum: Record<number, typeof allRelationships> = {};
    for (const rel of allRelationships) {
      if (!relationshipsByAlbum[rel.album_id]) {
        relationshipsByAlbum[rel.album_id] = [];
      }
      relationshipsByAlbum[rel.album_id].push(rel);
    }

    // 提取分页后的视频ID
    const videoIds: number[] = [];
    const videoSkip = (query.videoPage - 1) * query.videoSize;
    for (const item of data) {
      const relationships = relationshipsByAlbum[item.id] || [];
      const paginated = relationships.slice(
        videoSkip,
        videoSkip + query.videoSize
      );
      // 将 bigint 转换为 number
      videoIds.push(...paginated.map(rel => Number(rel.videos_id)));
    }

    // 一次性查询所有视频
    const videoMap = new Map<number, VideoEntity>();
    if (videoIds.length) {
      const videos = await this.videoEntity.findBy({ id: In(videoIds) });
      for (const video of videos) {
        videoMap.set(video.id, video);
      }
    }

    // 组装数据
    for (const item of data) {
      const relationships = relationshipsByAlbum[item.id] || [];
      const paginated = relationships.slice(
        videoSkip,
        videoSkip + query.videoSize
      );
      (item as AlbumVideoInfo)['list'] = paginated
        .map(rel => videoMap.get(Number(rel.videos_id)))
        .filter((v): v is VideoEntity => !!v);
    }

    return { list: data as AlbumVideoInfo[] };
  }
}
