import { Config, Inject, Provide } from '@midwayjs/decorator';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { UserInfoEntity } from '../entity/info';
import { UserWxService } from './wx';
import * as jwt from 'jsonwebtoken';
import { UserWxEntity } from '../entity/wx';
import { CoolFile } from '@cool-midway/file';
import { BaseSysLoginService } from '../../base/service/sys/login';
import { UserSmsService } from './sms';
import { v1 as uuid } from 'uuid';

/**
 * 登录
 */
@Provide()
export class UserLoginService extends BaseService {
  @InjectEntityModel(UserInfoEntity)
  userInfoEntity: Repository<UserInfoEntity>;

  @InjectEntityModel(UserWxEntity)
  userWxEntity: Repository<UserWxEntity>;

  @Inject()
  userWxService: UserWxService;

  @Config('module.user.jwt')
  jwtConfig;

  @Inject()
  baseSysLoginService: BaseSysLoginService;

  @Inject()
  file: CoolFile;

  @Inject()
  userSmsService: UserSmsService;

  /**
   * 发送手机验证码
   * @param phone
   * @param captchaId
   * @param code
   */
  async smsCode(phone, captchaId, code) {
    // 1、检查图片验证码  2、发送短信验证码
    const check = await this.baseSysLoginService.captchaCheck(captchaId, code);
    if (!check) {
      throw new CoolCommException('图片验证码错误');
    }
    this.userSmsService.sendSms(phone);
  }

  /**
   *  手机登录
   * @param phone
   * @param smsCode
   */
  async phone(phone, smsCode) {
    // 1、检查短信验证码  2、登录
    //const check = await this.userSmsService.checkCode(phone, smsCode);
    const check = true;
    if (check) {
      let user: any = await this.userInfoEntity.findOneBy({ phone });
      if (!user) {
        user = {
          phone,
          unionid: phone,
          loginType: 2,
          nickName: phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2'),
        };
        await this.userInfoEntity.insert(user);
      }
      return this.token({ id: user.id });
    }
  }

  /**
   * 公众号登录
   * @param code
   */
  async mp(code: string) {
    let wxUserInfo = await this.userWxService.mpUserInfo(code);
    if (wxUserInfo) {
      delete wxUserInfo.privilege;
      wxUserInfo = await this.saveWxInfo(
        {
          openid: wxUserInfo.openid,
          unionid: wxUserInfo.unionid,
          avatarUrl: wxUserInfo.headimgurl,
          nickName: wxUserInfo.nickname,
          gender: wxUserInfo.sex,
          city: wxUserInfo.city,
          province: wxUserInfo.province,
          country: wxUserInfo.country,
        },
        1
      );
      return this.wxLoginToken(wxUserInfo);
    } else {
      throw new CoolCommException('微信登录失败');
    }
  }

  /**
<<<<<<< HEAD
   * 保存微信信息
   * @param wxUserInfo
   * @param type
   * @returns
   */
  async saveWxInfo(wxUserInfo, type) {
    const find: any = { openid: wxUserInfo.openid };
    let wxInfo: any = await this.userWxEntity.findOneBy(find);
    if (wxInfo) {
      wxUserInfo.id = wxInfo.id;
    }
    await this.userWxEntity.save({
      ...wxUserInfo,
      type,
    });
    return wxUserInfo;
=======
   * 保存/更新 微信信息(根据微信规则，用户头像昵称无法在此获取，需要通过chooseAvatar进行获取)
   * @param wxUserInfo 微信里的用户信息
   * @returns
   */
  async saveWxInfo(wxUserInfo) {
    const wxInfo = await this.userWxEntity.findOneBy({ openid: wxUserInfo.openid });
    if (!wxInfo) {
      await this.userWxEntity.insert(wxInfo);
    }
    await this.userWxEntity.save(Object.assign(wxInfo, wxUserInfo));
    return wxInfo;
>>>>>>> 6a9a421c61366184f92aea3f742a577d944d2879
  }

  /**
   * 小程序登录
   * @param code
   * @param encryptedData
   * @param iv
   */
  async mini(code, encryptedData, iv) {
    let wxUserInfo = await this.userWxService.miniUserInfo(
      code,
      encryptedData,
      iv
    );
    if (wxUserInfo) {
<<<<<<< HEAD
      // 保存
      wxUserInfo = await this.saveWxInfo(wxUserInfo, 0);
      return await this.wxLoginToken(wxUserInfo);
=======
      wxUserInfo = await this.saveWxInfo(wxUserInfo);
      return this.wxLoginToken(wxUserInfo, 0);
>>>>>>> 6a9a421c61366184f92aea3f742a577d944d2879
    }
  }

  /**
   * 微信登录 获得token
   * @param wxUserInfo 微信用户信息
   * @param loginType 登录方式 0-小程序 1-公众号 2-H5
   * @returns
   */
  async wxLoginToken(wxUserInfo, loginType) {
    const unionid = wxUserInfo.unionid ? wxUserInfo.unionid : wxUserInfo.openid;
    let userInfo: UserInfoEntity = await this.userInfoEntity.findOneBy({ unionid });
    if (!userInfo) {
<<<<<<< HEAD
      const avatarUrl = await this.file.downAndUpload(
        wxUserInfo.avatarUrl,
        uuid() + '.png'
      );
      userInfo = {
        unionid,
        nickName: wxUserInfo.nickName,
        avatarUrl,
        gender: wxUserInfo.gender,
      };
      await this.userInfoEntity.insert(userInfo);
    }
    return this.token({ id: userInfo.id });
  }

  /**
   * 刷新token
   * @param refreshToken
   */
  async refreshToken(refreshToken) {
    try {
      const info = jwt.verify(refreshToken, this.jwtConfig.secret);
      if (!info['isRefresh']) {
        throw new CoolCommException('token类型非refreshToken');
      }
      const userInfo = await this.userInfoEntity.findOneBy({
        id: info['userId'],
      });
      return this.token(userInfo);
    } catch (e) {
      throw new CoolCommException(
        '刷新token失败，请检查refreshToken是否正确或过期'
      );
=======
      userInfo = new UserInfoEntity();
      Object.assign(userInfo, {
        unionid,
        loginType,
        ...wxUserInfo
      });
      await this.userInfoEntity.insert(userInfo);
>>>>>>> 6a9a421c61366184f92aea3f742a577d944d2879
    }
    if (userInfo.status === 0) {
      throw new CoolCommException('您已违规被禁用');
    }
    // 更新登录时间
    await this.userInfoEntity.save(Object.assign(userInfo, wxUserInfo));
    return this.token({ userId: userInfo.id });
  }

  /**
   * 获得token
   * @param info
   * @returns
   */
  async token(info) {
    const { expire, refreshExpire } = this.jwtConfig;
    return {
      expire,
      token: await this.generateToken(info),
      refreshExpire,
      refreshToken: await this.generateToken(info, true),
    };
  }

  /**
   * 生成token
   * @param tokenInfo 信息
   * @param roleIds 角色集合
   */
  async generateToken(info, isRefresh = false) {
    const { expire, refreshExpire, secret } = this.jwtConfig;
    const tokenInfo = {
      isRefresh,
      ...info,
    };
    return jwt.sign(tokenInfo, secret, {
      expiresIn: isRefresh ? refreshExpire : expire,
    });
  }
}
