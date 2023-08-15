import { Config, Provide } from '@midwayjs/decorator';
import { BaseService, CoolCache, CoolCommException } from '@cool-midway/core';
import axios from 'axios';
import * as crypto from 'crypto';
import { v1 as uuid } from 'uuid';
import * as moment from 'moment';

/**
 * 微信
 */
@Provide()
export class UserWxService extends BaseService {
  @Config('module.user')
  config;

  /**
   * 获得微信配置
   * @param appId
   * @param appSecret
   * @param url 当前网页的URL，不包含#及其后面部分(必须是调用JS接口页面的完整URL)
   */
  public async getWxMpConfig(url: string) {
    const token = await this.getWxToken();
    const ticket = await axios.get(
      'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
      {
        params: {
          access_token: token.access_token,
          type: 'jsapi',
        },
      }
    );
    const { appid } = this.config.wx.mp;
    // 返回结果集
    const result = {
      timestamp: parseInt(moment().valueOf() / 1000 + ''),
      nonceStr: uuid(),
      appId: appid, //appid
      signature: '',
    };
    const signArr = [];
    signArr.push('jsapi_ticket=' + ticket.data.ticket);
    signArr.push('noncestr=' + result.nonceStr);
    signArr.push('timestamp=' + result.timestamp);
    signArr.push('url=' + decodeURI(url));
    // 敏感信息加密处理
    result.signature = crypto
      .createHash('sha1')
      .update(signArr.join('&'))
      .digest('hex')
      .toUpperCase();
    return result;
  }

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
  @CoolCache(3600)
  public async getWxToken(type = 'mp') {
    //@ts-ignore
    const conf = this.config.wx[type];
    const result = await axios.get('https://api.weixin.qq.com/cgi-bin/token', {
      params: {
        grant_type: 'client_credential',
        appid: conf.appid,
        secret: conf.secret,
      },
    });
    return result.data;
  }

  /**
   * 获得用户信息
   * @param token
   */
  async openOrMpUserInfo(token) {
    return await axios
      .get('https://api.weixin.qq.com/sns/userinfo', {
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
   * 获得token嗯
   * @param code
   * @param conf
   */
  async openOrMpToken(code, conf) {
    const result = await axios.get(
      'https://api.weixin.qq.com/sns/oauth2/access_token',
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
      'https://api.weixin.qq.com/sns/jscode2session',
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
    if (info) {
      delete info['watermark'];
      return {
        ...info,
        openid: session['openid'],
        unionid: session['unionid'],
      };
    }
    return null;
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
      // 解密
      const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);
      // 设置自动 padding 为 true，删除填充补位
      decipher.setAutoPadding(true);
      // @ts-ignore
      let decoded = decipher.update(encryptedData, 'binary', 'utf8');
      // @ts-ignore
      decoded += decipher.final('utf8');
      // @ts-ignore
      decoded = JSON.parse(decoded);
      return decoded;
    } catch (err) {
      throw new CoolCommException('获得信息失败');
    }
  }
}
