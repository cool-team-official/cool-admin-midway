import { Config, Provide } from "@midwayjs/core";
import { CoolYpConfig } from "./interface";
import { CoolCommException } from "@cool-midway/core";
import axios from 'axios';

/**
 * 云片短信
 */
@Provide()
export class SmsYp {
    @Config('cool.sms.yp')
    config: CoolYpConfig;

    /**
     * 配置
     * @param config 
     */
    setConfig(config: CoolYpConfig) {
        this.config = config;
    }

    /**
    * 发送短信
    * @param phones 手机号 数组，需要加国家码如 ["+8612345678901"]
    * @param params 参数
    * @param config  signName 签名 template 模板
    * @returns 
    */
    async send(phones: string, params: {
        [key: string]: string;
    }, config?: {
        signName: string;
        template: string;
    }) {
        const { apikey } = this.config;
        if (!config) {
            config = {
                signName: this.config.signName,
                template: this.config.template,
            };
        }
        if (!apikey) {
            throw new CoolCommException('请配置云片短信');
        }

        const headers = {
            Accept: 'application/json;charset=utf-8',
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        };
        const data = {
            apikey: apikey,
            mobile: phones,
            tpl_id: config.template,
            tpl_value: this.smsTplValue(params),
        };
        const result = await axios.post(
            'https://sms.yunpian.com/v2/sms/tpl_single_send.json',
            data,
            { headers }
        );
        if (result.data.code === 0) {
            return true;
        }
        return false;
    }

    /**
     * 获得短信模板值
     * @param obj
     * @returns
     */
    protected smsTplValue(obj) {
        const urlParams = [];

        for (let key in obj) {
            // eslint-disable-next-line no-prototype-builtins
            if (obj.hasOwnProperty(key)) {
                const encodedKey = encodeURIComponent(`#${key}#`);
                const encodedValue = encodeURIComponent(obj[key]);
                urlParams.push(`${encodedKey}=${encodedValue}`);
            }
        }

        return urlParams.join('&');
    }
}