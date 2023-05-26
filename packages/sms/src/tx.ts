import { Config, Provide } from "@midwayjs/core";
import { CoolTxConfig } from './interface';
import * as tencentcloud from "tencentcloud-sdk-nodejs";
import { CoolCommException } from "@cool-midway/core";

/**
 * 腾讯云短信
 */
@Provide()
export class SmsTx {
    @Config('cool.sms.tx')
    config: CoolTxConfig;

    /**
     * 配置
     * @param config 
     */
    setConfig(config: CoolTxConfig) {
        this.config = config;
    }

    /**
     * 发送短信
     * @param phone 手机号
     * @param params 参数
     * @param config  signName 签名 template 模板
     * @returns 
     */
    async send(phone: string, params: string[], config?: {
        signName: string;
        template: string;
    }) {
        const { appId, secretId, secretKey } = this.config;
        if(!config) {
            config = {
                signName: this.config.signName,
                template: this.config.template,
            };
        }
        if(!appId || !secretId || !secretKey) {
            throw new CoolCommException('请配置腾讯云短信');
        }
        const smsClient = tencentcloud.sms.v20210111.Client;

        const client = new smsClient({
            credential: {
                secretId,
                secretKey,
            },
            region: 'ap-guangzhou',
            profile: {
                signMethod: 'HmacSHA256',
                httpProfile: {
                    reqMethod: 'POST',
                    reqTimeout: 30,
                    endpoint: 'sms.tencentcloudapi.com',
                },
            },
        });

        const data = {
            SmsSdkAppId: appId,
            SignName: config.signName,
            TemplateId: config.template,
            TemplateParamSet: params,
            PhoneNumberSet: [`+86${phone}`],
          };
          return client.SendSms(data);
    }
}