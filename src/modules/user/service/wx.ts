import { Config, Provide } from '@midwayjs/decorator';
import { BaseService, CoolCommException } from '@cool-midway/core';
import axios from 'axios';
import * as crypto from 'crypto';
import * as _ from 'lodash';

// 微信请求域名
const wxBaseUrl = 'https://api.weixin.qq.com';

/**
 * 微信
 */
@Provide()
export class UserWxService extends BaseService {
  @Config('module.user')
  config;

  /**
   * 获得公众号用户信息
   * @param code
   */
  async mpUserInfo(code) {
    const token = await this.openOrMpToken(code, this.config.wx.mp);
    return await this.openOrMpUserInfo(token);
  }

  /**
   * 获得微信token 不用code
   * @param appid
   * @param secret
   */
  public async getWxToken(type = 'mp') {
    const conf = this.config.wx[type];
    return await axios.get(wxBaseUrl + '/cgi-bin/token', {
      params: {
        grant_type: 'client_credential',
        appid: conf.appid,
        secret: conf.secret,
      },
    });
  }

  /**
   * 获得用户信息
   * @param token
   */
  async openOrMpUserInfo(token) {
    return await axios
      .get(wxBaseUrl + '/sns/userinfo', {
        params: {
          access_token: token.access_token,
          openid: token.openid,
          lang: 'zh_CN',
        },
      })
      .then(res => {
        return res.data;
      });
  }

  /**
   * 获得token
   * @param code
   * @param conf
   */
  async openOrMpToken(code, conf) {
    const result = await axios.get(
      wxBaseUrl + '/sns/oauth2/access_token',
      {
        params: {
          appid: conf.appid,
          secret: conf.secret,
          code,
          grant_type: 'authorization_code',
        },
      }
    );
    return result.data;
  }

  /**
   * 获得小程序session
   * @param code 微信code
   * @param conf 配置
   */
  async miniSession(code) {
    const { appid, secret } = this.config.wx.mini;
    const result = await axios.get(
      wxBaseUrl + '/sns/jscode2session',
      {
        params: {
          appid,
          secret,
          js_code: code,
          grant_type: 'authorization_code',
        },
      }
    );

    return result.data;
  }

  /**
   * 获得小程序用户信息
   * @param code
   * @param encryptedData
   * @param iv
   */
  async miniUserInfo(code, encryptedData, iv) {
    const session = await this.miniSession(code);
    if (session.errcode) {
      throw new CoolCommException('登录失败，请重试');
    }
    const info: any = await this.miniDecryptData(
      encryptedData,
      iv,
      session.session_key
    );
    delete info['watermark'];
    info.openid = session['openid'];
    info.unionid = session['unionid'];
    return _.pickBy({ ...info });
  }

  /**
   * 获得小程序手机
   * @param code
   * @param encryptedData
   * @param iv
   */
  async miniPhone(code, encryptedData, iv) {
    const session = await this.miniSession(code);
    if (session.errcode) {
      throw new CoolCommException('获取手机号失败，请刷新重试');
    }
    return await this.miniDecryptData(encryptedData, iv, session.session_key);
  }

  /**
   * 小程序信息解密
   * @param encryptedData
   * @param iv
   * @param sessionKey
   */
  async miniDecryptData(encryptedData, iv, sessionKey) {
    sessionKey = Buffer.from(sessionKey, 'base64');
    encryptedData = Buffer.from(encryptedData, 'base64');
    iv = Buffer.from(iv, 'base64');
    try {
      const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);
      decipher.setAutoPadding(true);
      let decoded = decipher.update(encryptedData, 'binary', 'utf8');
      decoded += decipher.final('utf8');
      return JSON.parse(decoded);
    } catch (err) {
      throw new CoolCommException('获得信息失败');
    }
  }
}
