import { Config, Inject, Provide } from "@midwayjs/core";
import { SmsYp } from "./yp";
import { SmsAli } from "./ali";
import { SmsTx } from "./tx";
import { CoolSmsConfig } from "./interface";

@Provide()
export class CoolSms {
    @Inject()
    smsYp: SmsYp

    @Inject()
    smsAli: SmsAli

    @Inject()
    smsTx: SmsTx

    @Config('cool.sms')
    config: CoolSmsConfig;

    /**
     * 配置
     * @param config 
     */
    setConfig(config: CoolSmsConfig) {
        this.smsYp.setConfig(config.yp);
        this.smsAli.setConfig(config.ali);
        this.smsTx.setConfig(config.tx);
        this.config = config;
    }

    /**
     * 发送验证码 模板字段名为：code
     * @param phone 
     * @param config 
     */
    async sendCode(phone, config?: {
        signName: string;
        template: string;
    }) {
        const code = this.generateNumber();
        let params = {
            code
        }
        await this.send(phone, this.config.tx ? [code] : params, config)
        return code;
    }

    /**
     * 发送短信
     * @param phone 
     * @param params 
     * @param config 
     * @returns 
     */
    async send(phone: string, params: any, config?: {
        signName: string;
        template: string;
    }) {
        if (this.config.ali) {
            return await this.smsAli.send(phone, params, config);
        }
        if (this.config.tx) {
            return await this.smsTx.send(phone, params, config);
        }
        if (this.config.yp) {
            return await this.smsYp.send(phone, params, config);
        }
        return true;
    }

    /**
     * 生成验证码
     */
    generateNumber(digits = 4) {
        if (digits <= 0) {
            return 0;
        }
        const min = Math.pow(10, digits - 1);
        const max = Math.pow(10, digits) - 1;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}