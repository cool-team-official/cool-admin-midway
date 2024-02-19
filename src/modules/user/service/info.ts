import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { UserInfoEntity } from '../entity/info';
import { v1 as uuid } from 'uuid';
import { UserSmsService } from './sms';
import * as md5 from 'md5';
import { PluginService } from '../../plugin/service/info';

/**
 * 用户信息
 */
@Provide()
export class UserInfoService extends BaseService {
  @InjectEntityModel(UserInfoEntity)
  userInfoEntity: Repository<UserInfoEntity>;

  @Inject()
  pluginService: PluginService;

  @Inject()
  userSmsService: UserSmsService;

  /**
   * 获取用户信息
   * @param id
   * @returns
   */
  async person(id) {
    return await this.userInfoEntity.findOneBy({ id });
  }

  /**
   * 注销
   * @param userId
   */
  async logoff(userId: number) {
    await this.userInfoEntity.update(
      { id: userId },
      {
        status: 2,
        phone: null,
        unionid: null,
        nickName: `已注销-00${userId}`,
        avatarUrl: null,
      }
    );
  }

  /**
   * 更新用户信息
   * @param id
   * @param param
   * @returns
   */
  async updatePerson(id, param) {
    try {
      const info = await this.person(id);
      // 修改了头像要重新处理
      if (param.avatarUrl && info.avatarUrl != param.avatarUrl) {
        const file = await this.pluginService.getInstance('upload');
        param.avatarUrl = await file.downAndUpload(
          param.avatarUrl,
          uuid() + '.png'
        );
      }
      return await this.userInfoEntity.update({ id }, param);
    } catch (err) {
      throw new CoolCommException('更新失败，参数错误或者手机号已存在');
    }
  }

  /**
   * 更新密码
   * @param userId
   * @param password
   * @param 验证码
   */
  async updatePassword(userId, password, code) {
    const user = await this.userInfoEntity.findOneBy({ id: userId });
    const check = await this.userSmsService.checkCode(user.phone, code);
    if (!check) {
      throw new CoolCommException('验证码错误');
    }
    await this.userInfoEntity.update(user.id, { password: md5(password) });
  }
}
