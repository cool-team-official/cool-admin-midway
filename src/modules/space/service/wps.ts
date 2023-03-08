import { SpaceTypeEntity } from './../entity/type';
import { SpaceInfoEntity } from './../entity/info';
import { Config, Inject, Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { In, Repository } from 'typeorm';
import * as _ from 'lodash';
import { BaseSysUserService } from '../../base/service/sys/user';
import * as moment from 'moment';
import * as fs from 'fs';
import { CacheManager } from '@midwayjs/cache';
import * as jwt from 'jsonwebtoken';
import { BaseSysUserEntity } from '../../base/entity/sys/user';
import { CoolFile } from '@cool-midway/file';

/**
 * 使用wps在线文档
 */
@Provide()
export class SpaceWpsService extends BaseService {
  @InjectEntityModel(SpaceInfoEntity)
  spaceInfoEntity: Repository<SpaceInfoEntity>;

  @InjectEntityModel(SpaceTypeEntity)
  spaceTypeEntity: Repository<SpaceTypeEntity>;

  @Inject()
  baseSysUserService: BaseSysUserService;

  @InjectEntityModel(BaseSysUserEntity)
  baseSysUserEntity: Repository<BaseSysUserEntity>;

  @Inject()
  ctx;

  @Inject()
  coolFile: CoolFile;

  @Inject()
  cacheManager: CacheManager;

  @Config('module.base')
  jwtConfig;

  /**
   * 根据filedId获取数据库文件信息
   * @param fileId
   */
  async getFileInfo(fileId) {
    return await this.spaceInfoEntity.findOneBy({
      fileId,
    });
  }

  /**
   * 校验文档权限
   */
  async verifyUser() {
    const token = this.ctx.request.header['x-weboffice-token'];
    let tokenData;
    try {
      tokenData = jwt.verify(token, this.jwtConfig.jwt.secret);
    } catch (err) {}
    let userInfo;
    if (tokenData) {
      userInfo = await this.baseSysUserEntity.findOneBy({
        id: tokenData.userId,
      });
    }
    if (_.isEmpty(userInfo)) {
      throw new Error('用户不存在');
    }
    return userInfo;
  }

  /**
   * 获得文件信息
   * @param file_id
   */
  async getFiles(file_id: string) {
    const userInfo = await this.verifyUser();
    const fileInfo = await this.getFileInfo(file_id);
    if (_.isEmpty(fileInfo)) {
      return {
        code: '40004',
        msg: '文档不存在',
      };
    }
    return {
      code: 0,
      data: {
        id: fileInfo.fileId,
        name: fileInfo.name,
        version: fileInfo.version,
        size: fileInfo.size,
        create_time: moment(fileInfo.createTime).valueOf(),
        modify_time: moment(fileInfo.updateTime).valueOf(),
        creator_id: String(userInfo.id),
        modifier_id: String(userInfo.id),
        attrs: { _w_third_file_id: fileInfo.fileId },
      },
    };
  }

  /**
   * 获取文件下载地址
   * @param file_id
   * @returns
   */
  async download(file_id: string) {
    await this.verifyUser();
    const fileInfo = await this.getFileInfo(file_id);
    return {
      code: 0,
      data: {
        url: fileInfo.url,
      },
    };
  }

  /**
   * 获取文档用户权限
   * @param file_id
   * @returns
   */
  async permission(file_id: string) {
    const userInfo = await this.verifyUser();
    return {
      code: 0,
      data: {
        user_id: String(userInfo.id),
        read: 1,
        update: 1,
        download: 1,
        rename: 0,
        history: 0,
        copy: 1,
        print: 1,
        saveas: 1,
        comment: 1,
      },
    };
  }

  /**
   * 文件上传
   * @param file_id
   * @param files
   * @param body
   * @returns
   */
  async upload(file_id: string, files) {
    const userInfo = await this.verifyUser();
    const fileInfo = await this.getFileInfo(file_id);
    const data = files[0].data;
    const stat = fs.statSync(data);
    await this.coolFile.uploadWithKey(files[0], fileInfo.key);

    fileInfo.version++;
    fileInfo.size = stat.size;
    await this.spaceInfoEntity.save(fileInfo);
    return {
      code: 0,
      data: {
        id: fileInfo.fileId,
        name: fileInfo.name,
        version: fileInfo.version,
        size: fileInfo.size,
        create_time: moment(fileInfo.createTime).valueOf(),
        modify_time: moment(fileInfo.updateTime).valueOf(),
        creator_id: String(userInfo.id),
        modifier_id: String(userInfo.id),
      },
    };
  }

  /**
   * 用户信息
   * @param user_ids
   * @returns
   */
  async users(user_ids: string[]) {
    const userInfos = await this.baseSysUserEntity.find({
      where: {
        id: In(user_ids),
      },
    });
    return {
      code: 0,
      data: userInfos.map(userInfo => {
        return {
          id: String(userInfo.id),
          name: userInfo.name,
          avatar_url: userInfo.headImg,
        };
      }),
    };
  }

  /**
   * 准备上传阶段
   * @param file_id
   * @returns
   */
  async uploadPrepare(file_id: string) {
    console.log('准备上传阶段:' + file_id);
    return {
      code: 0,
      data: {
        digest_types: ['sha1'],
      },
      msg: '',
    };
  }

  /**
   * 获取上传地址
   * @param file_id
   * @param body
   * @returns
   */
  async uploadAddress(file_id: string, body: any) {
    console.log('获取上传地址:' + file_id);
    console.log(body);
    const fileInfo = await this.getFileInfo(file_id);
    const uploadRes = await this.coolFile.downAndUpload(
      body.url,
      fileInfo.name
    );
    if (!uploadRes) {
      return {
        code: '41001',
        msg: '文件未正确上传',
      };
    }
    return {
      code: 0,
      data: {
        method: 'PUT',
        url: uploadRes,
      },
      msg: '',
    };
  }

  /**
   * 上传完成后，回调通知上传结果
   * @param file_id
   * @param body
   * @returns
   */
  async uploadComplete(file_id: string, body: any) {
    console.log('上传完成后，回调通知上传结果:' + file_id);
    console.log(body);
    const userInfo = await this.baseSysUserService.person();
    const fileInfo = await this.getFileInfo(file_id);
    return {
      code: 0,
      data: {
        id: fileInfo.fileId,
        name: fileInfo.name,
        version: fileInfo.version,
        size: fileInfo.size,
        create_time: moment(fileInfo.createTime).valueOf(),
        modify_time: moment(fileInfo.updateTime).valueOf(),
        creator_id: String(userInfo.id),
        modifier_id: String(userInfo.id),
      },
    };
  }
}
