import * as Core from '@alicloud/pop-core';
import { Config, Provide } from "@midwayjs/core";
import { CoolSmsAliConfig } from './interface';
import { CoolCommException } from '@cool-midway/core';

/**
 * 阿里云短信
 */
@Provide()
export class SmsAli {
    @Config('cool.sms.ali')
    config: CoolSmsAliConfig;

    /**
     * 配置
     * @param config 
     */
    setConfig(config: CoolSmsAliConfig) {
        this.config = config;
    }

    /**
     * 发送短信
     * @param phone 手机号
     * @param params 参数
     * @param config  signName 签名 template 模板
     * @returns 
     */
    async send(phone, params: {
        [key: string]: string;
    }, config?: {
        signName: string;
        template: string;
    }) {
        const { accessKeyId, accessKeySecret } = this.config;
        if (!accessKeyId || !accessKeyId) {
            throw new CoolCommException('请配置阿里云短信');
        }
        if (!config) {
            config = {
                signName: this.config.signName,
                template: this.config.template,
            };
        }
        const client = new Core({
            accessKeyId,
            accessKeySecret,
            endpoint: 'https://dysmsapi.aliyuncs.com',
            // endpoint: 'https://cs.cn-hangzhou.aliyuncs.com',
            apiVersion: '2017-05-25',
            // apiVersion: '2018-04-18',
        });
        const data = {
            RegionId: 'cn-shanghai',
            PhoneNumbers: phone,
            signName: config.signName,
            templateCode: config.template,
            TemplateParam: JSON.stringify(params),
        };
        return await client.request('SendSms', data, {
            method: 'POST',
        });
    }
}