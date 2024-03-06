import { Inject, Provide, Config, InjectClient } from '@midwayjs/decorator';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { LoginDTO } from '../../dto/login';
import * as svgCaptcha from 'svg-captcha';
import { v1 as uuid } from 'uuid';
import { BaseSysUserEntity } from '../../entity/sys/user';
import { Repository } from 'typeorm';
import { InjectEntityModel } from '@midwayjs/typeorm';
import * as md5 from 'md5';
import { BaseSysRoleService } from './role';
import * as _ from 'lodash';
import { BaseSysMenuService } from './menu';
import { BaseSysDepartmentService } from './department';
import * as jwt from 'jsonwebtoken';
import * as svgToDataURL from 'mini-svg-data-uri';
import { Context } from '@midwayjs/koa';
import { CachingFactory, MidwayCache } from '@midwayjs/cache-manager';
import { readFileSync } from 'fs';
const { svg2png, initialize } = require('svg2png-wasm');
initialize(readFileSync('./node_modules/svg2png-wasm/svg2png_wasm_bg.wasm'));

/**
 * 登录
 */
@Provide()
export class BaseSysLoginService extends BaseService {
  @InjectClient(CachingFactory, 'default')
  midwayCache: MidwayCache;

  @InjectEntityModel(BaseSysUserEntity)
  baseSysUserEntity: Repository<BaseSysUserEntity>;

  @Inject()
  baseSysRoleService: BaseSysRoleService;

  @Inject()
  baseSysMenuService: BaseSysMenuService;

  @Inject()
  baseSysDepartmentService: BaseSysDepartmentService;

  @Inject()
  ctx: Context;

  @Config('module.base')
  coolConfig;

  /**
   * 登录
   * @param login
   */
  async login(login: LoginDTO) {
    const { username, captchaId, verifyCode, password } = login;
    // 校验验证码
    const checkV = await this.captchaCheck(captchaId, verifyCode);
    if (checkV) {
      const user = await this.baseSysUserEntity.findOneBy({ username });
      // 校验用户
      if (user) {
        // 校验用户状态及密码
        if (user.status === 0 || user.password !== md5(password)) {
          throw new CoolCommException('账户或密码不正确~');
        }
      } else {
        throw new CoolCommException('账户或密码不正确~');
      }
      // 校验角色
      const roleIds = await this.baseSysRoleService.getByUser(user.id);
      if (_.isEmpty(roleIds)) {
        throw new CoolCommException('该用户未设置任何角色，无法登录~');
      }

      // 生成token
      const { expire, refreshExpire } = this.coolConfig.jwt.token;
      const result = {
        expire,
        token: await this.generateToken(user, roleIds, expire),
        refreshExpire,
        refreshToken: await this.generateToken(
          user,
          roleIds,
          refreshExpire,
          true
        ),
      };

      // 将用户相关信息保存到缓存
      const perms = await this.baseSysMenuService.getPerms(roleIds);
      const departments = await this.baseSysDepartmentService.getByRoleIds(
        roleIds,
        user.username === 'admin'
      );
      await this.midwayCache.set(`admin:department:${user.id}`, departments);
      await this.midwayCache.set(`admin:perms:${user.id}`, perms);
      await this.midwayCache.set(`admin:token:${user.id}`, result.token);
      await this.midwayCache.set(
        `admin:token:refresh:${user.id}`,
        result.token
      );

      return result;
    } else {
      throw new CoolCommException('验证码不正确');
    }
  }

  /**
   * 验证码
   * @param type 图片验证码类型 svg
   * @param width 宽
   * @param height 高
   */
  async captcha(type: string, width = 150, height = 50, color = '#fff') {
    const svg = svgCaptcha.create({
      ignoreChars: 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM',
      width,
      height,
    });
    const result = {
      captchaId: uuid(),
      data: svg.data.replace(/"/g, "'"),
    };
    // 文字变白
    const rpList = [
      '#111',
      '#222',
      '#333',
      '#444',
      '#555',
      '#666',
      '#777',
      '#888',
      '#999',
    ];
    rpList.forEach(rp => {
      result.data = result.data['replaceAll'](rp, color);
    });
    if (type === 'base64') {
      result.data = svgToDataURL(result.data);
    }
    if (type === 'png') {
      result.data = await svg2png(result.data, {
        scale: 2, // optional
        width, // optional
        height, // optional
        backgroundColor: 'white', // optional
      });
      result.data =
        'data:image/png;base64,' +
        Buffer.from(result.data, 'binary').toString('base64');
    }
    // 半小时过期
    await this.midwayCache.set(
      `verify:img:${result.captchaId}`,
      svg.text.toLowerCase(),
      1800 * 1000
    );
    return result;
  }

  /**
   * 退出登录
   */
  async logout() {
    if (!this.coolConfig.jwt.sso) return;
    const { userId } = this.ctx.admin;
    await this.midwayCache.del(`admin:department:${userId}`);
    await this.midwayCache.del(`admin:perms:${userId}`);
    await this.midwayCache.del(`admin:token:${userId}`);
    await this.midwayCache.del(`admin:token:refresh:${userId}`);
    await this.midwayCache.del(`admin:passwordVersion:${userId}`);
  }

  /**
   * 检验图片验证码
   * @param captchaId 验证码ID
   * @param value 验证码
   */
  async captchaCheck(captchaId, value) {
    const rv = await this.midwayCache.get(`verify:img:${captchaId}`);
    if (!rv || !value || value.toLowerCase() !== rv) {
      return false;
    } else {
      this.midwayCache.del(`verify:img:${captchaId}`);
      return true;
    }
  }

  /**
   * 生成token
   * @param user 用户对象
   * @param roleIds 角色集合
   * @param expire 过期
   * @param isRefresh 是否是刷新
   */
  async generateToken(user, roleIds, expire, isRefresh?) {
    await this.midwayCache.set(
      `admin:passwordVersion:${user.id}`,
      user.passwordV
    );
    const tokenInfo = {
      isRefresh: false,
      roleIds,
      username: user.username,
      userId: user.id,
      passwordVersion: user.passwordV,
    };
    if (isRefresh) {
      tokenInfo.isRefresh = true;
    }
    return jwt.sign(tokenInfo, this.coolConfig.jwt.secret, {
      expiresIn: expire,
    });
  }

  /**
   * 刷新token
   * @param token
   */
  async refreshToken(token: string) {
    const decoded = jwt.verify(token, this.coolConfig.jwt.secret);
    if (decoded && decoded['isRefresh']) {
      delete decoded['exp'];
      delete decoded['iat'];

      const { expire, refreshExpire } = this.coolConfig.jwt.token;
      decoded['isRefresh'] = false;
      const result = {
        expire,
        token: jwt.sign(decoded, this.coolConfig.jwt.secret, {
          expiresIn: expire,
        }),
        refreshExpire,
        refreshToken: '',
      };
      decoded['isRefresh'] = true;
      result.refreshToken = jwt.sign(decoded, this.coolConfig.jwt.secret, {
        expiresIn: refreshExpire,
      });
      await this.midwayCache.set(
        `admin:passwordVersion:${decoded['userId']}`,
        decoded['passwordVersion']
      );
      await this.midwayCache.set(
        `admin:token:${decoded['userId']}`,
        result.token
      );
      return result;
    }
  }
}
