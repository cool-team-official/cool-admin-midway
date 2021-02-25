import { Config, Inject, Provide } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayWebNext } from '@midwayjs/web';
import * as _ from 'lodash';
import { CoolCache, CoolConfig, RESCODE } from 'midwayjs-cool-core';
import * as jwt from 'jsonwebtoken';
import { Context } from 'egg';

/**
 * 权限校验
 */
@Provide()
export class BaseAuthorityMiddleware implements IWebMiddleware {

    @Config('cool')
    coolConfig: CoolConfig;

    @Inject('cool:cache')
    coolCache: CoolCache;

    resolve() {
        return async (ctx: Context, next: IMidwayWebNext) => {
            let statusCode = 200;
            const { url } = ctx;
            const token = ctx.get('Authorization');
            let { prefix } = this.coolConfig.router;
            const adminUrl = prefix ? `${prefix}/admin/` : '/admin/';
            // 只要登录每个人都有权限的接口
            const commUrl = prefix ? `${prefix}/admin/comm/` : '/admin/comm/';
            // 不需要登录的接口
            const openUrl = prefix ? `${prefix}/admin/open/` : '/admin/open/';
            // 路由地址为 admin前缀的 需要权限校验
            if (_.startsWith(url, adminUrl)) {
                try {
                    ctx.admin = jwt.verify(token, this.coolConfig.jwt.secret);
                } catch (err) { }
                // comm 不需要登录 无需权限校验
                if (_.startsWith(url, openUrl)) {
                    await next();
                    return;
                }
                if (ctx.admin) {
                    if (_.startsWith(url, commUrl)) {
                        await next();
                        return;
                    }
                    // 如果传的token是refreshToken则校验失败
                    if (ctx.admin.isRefresh) {
                        ctx.status = 401;
                        ctx.body = {
                            code: RESCODE.COMMFAIL,
                            message: '登录失效~',
                        };
                        return;
                    }
                    // 判断密码版本是否正确
                    const passwordV = await this.coolCache.get(`admin:passwordVersion:${ctx.admin.userId}`);
                    if (passwordV !== ctx.admin.passwordVersion) {
                        ctx.status = 401;
                        ctx.body = {
                            code: RESCODE.COMMFAIL,
                            message: '登录失效~',
                        };
                        return;
                    }
                    const rToken = await this.coolCache.get(`admin:token:${ctx.admin.userId}`);
                    if (!rToken) {
                        ctx.status = 401;
                        ctx.body = {
                            code: RESCODE.COMMFAIL,
                            message: '登录失效或无权限访问~',
                        };
                        return;
                    }
                    if (rToken !== token && this.coolConfig.sso) {
                        statusCode = 401;
                    } else {
                        let perms = await this.coolCache.get(`admin:perms:${ctx.admin.userId}`);
                        if (!_.isEmpty(perms)) {
                            perms = JSON.parse(perms).map(e => {
                                return e.replace(/:/g, '/');
                            });
                            if (!perms.includes(url.split('?')[0].replace('/admin/', ''))) {
                                statusCode = 403;
                            }
                        } else {
                            statusCode = 403;
                        }
                    }
                } else {
                    statusCode = 401;
                }
                if (statusCode > 200) {
                    ctx.status = statusCode;
                    ctx.body = {
                        code: RESCODE.COMMFAIL,
                        message: '登录失效或无权限访问~',
                    };
                    return;
                }
            }
            await next();
        };
    }

}