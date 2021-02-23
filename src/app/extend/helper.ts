import * as ipdb from 'ipip-ipdb';
import * as _ from 'lodash';

/**
 * 帮助类
 */
export default class Helper {
   /**
     * 获得请求IP
     */
    public static async getReqIP() {
        // @ts-ignore
        const req = this.ctx.req;
        return (req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
            req.connection.remoteAddress || // 判断 connection 的远程 IP
            req.socket.remoteAddress || // 判断后端的 socket 的 IP
            req.connection.socket.remoteAddress).replace('::ffff:', '');
    }

    /**
     * 根据IP获得请求地址
     * @param ip 为空时则为当前请求的IP地址
     */
    public static async getIpAddr(ip?: string) {
        try {
            if (!ip) {
                ip = await this.getReqIP();
            }
            const bst = new ipdb.BaseStation('app/resource/ipip/ipipfree.ipdb');
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
    public static async removeEmptyP (obj) {
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
    public static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
