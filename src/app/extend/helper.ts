import { Provide } from '@midwayjs/decorator';
import * as ipdb from 'ipip-ipdb';
import * as _ from 'lodash';
import { Context } from 'egg';

/**
 * 帮助类
 */
@Provide()
 export class Helper {
    /**
      * 获得请求IP
      */
    public async getReqIP(ctx: Context) {
        const req = ctx.req;
        return req.headers['x-forwarded-for'] || req.socket.remoteAddress
    }

    /**
     * 根据IP获得请求地址
     * @param ip 为空时则为当前请求的IP地址
     */
    public async getIpAddr(ctx: Context, ip?: string | string[]) {
        try {
            if (!ip) {
                ip = await this.getReqIP(ctx);
            }
            const bst = new ipdb.BaseStation('./ipipfree.ipdb');
            const result = bst.findInfo(ip, 'CN');
            const addArr: any = [];
            if (result) {
                addArr.push(result.countryName);
                addArr.push(result.regionName);
                addArr.push(result.cityName);
                return _.uniq(addArr).join('');
            }
            // @ts-ignore
        } catch (err) {
            return '无法获取地址信息';
        }
    }

    /**
     * 去除对象的空值属性
     * @param obj
     */
    public async removeEmptyP(obj) {
        Object.keys(obj).forEach(key => {
            if (obj[key] === null || obj[key] === '' || obj[key] === 'undefined') {
                delete obj[key];
            }
        });
    }

    /**
     * 线程阻塞毫秒数
     * @param ms
     */
    public sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
