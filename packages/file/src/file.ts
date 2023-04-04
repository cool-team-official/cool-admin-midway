import {
  App,
  Config,
  Init,
  Logger,
  Provide,
  Scope,
  ScopeEnum,
} from '@midwayjs/decorator';
import { Mode, CoolFileConfig, MODETYPE, CLOUDTYPE } from './interface';
import { CoolCommException } from '@cool-midway/core';
import * as moment from 'moment';
import { v1 as uuid } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { ILogger, IMidwayApplication } from '@midwayjs/core';
import * as _ from 'lodash';
import * as OSS from 'ali-oss';
import * as crypto from 'crypto';
import * as STS from 'qcloud-cos-sts';
import * as download from 'download';
import * as COS from 'cos-nodejs-sdk-v5';
import * as QINIU from 'qiniu';

/**
 * 文件上传
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class CoolFile {
  @Config('cool.file')
  config: CoolFileConfig;

  @Logger()
  coreLogger: ILogger;

  client: OSS & COS & QINIU.auth.digest.Mac;

  @App()
  app: IMidwayApplication;

  @Init()
  async init(config: CoolFileConfig) {
    const filePath = path.join(this.app.getBaseDir(), '..', 'public');
    const uploadsPath = path.join(filePath, 'uploads');
    const tempPath = path.join(filePath, 'temp');
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath);
    }
    if (!fs.existsSync(tempPath)) {
      fs.mkdirSync(tempPath);
    }
    if (config) {
      this.config = config;
    }
    const { mode, oss, cos, qiniu } = this.config;
    if (mode == MODETYPE.CLOUD) {
      if (oss) {
        const { accessKeyId, accessKeySecret, bucket, endpoint } = oss;
        this.client = new OSS({
          region: endpoint.split('.')[0],
          accessKeyId,
          accessKeySecret,
          bucket,
        });
      }
      if (cos) {
        const { accessKeyId, accessKeySecret } = cos;
        this.client = new COS({
          SecretId: accessKeyId,
          SecretKey: accessKeySecret,
        });
      }
      if (qiniu) {
        const { accessKeyId, accessKeySecret } = qiniu;
        this.client = new QINIU.auth.digest.Mac(accessKeyId, accessKeySecret);
      }
    }
  }

  /**
   * 上传模式
   * @returns 上传模式
   */
  async getMode(): Promise<Mode> {
    const { mode, oss, cos, qiniu } = this.config;
    if (mode == MODETYPE.LOCAL) {
      return {
        mode: MODETYPE.LOCAL,
        type: MODETYPE.LOCAL,
      };
    }
    if (oss) {
      return {
        mode: MODETYPE.CLOUD,
        type: CLOUDTYPE.OSS,
      };
    }
    if (cos) {
      return {
        mode: MODETYPE.CLOUD,
        type: CLOUDTYPE.COS,
      };
    }
    if (qiniu) {
      return {
        mode: MODETYPE.CLOUD,
        type: CLOUDTYPE.QINIU,
      };
    }
  }

  /**
   * 获得原始操作对象
   * @returns
   */
  getMetaFileObj(): OSS & COS & QINIU.auth.digest.Mac {
    return this.client;
  }

  /**
   * 下载并上传
   * @param url
   * @param fileName 文件名
   */
  async downAndUpload(url: string, fileName?: string) {
    const { mode, oss, cos, qiniu, domain } = this.config;
    let extend = '';
    if (url.includes('.')) {
      const urlArr = url.split('.');
      extend = '.' + urlArr[urlArr.length - 1].split('?')[0];
    }

    const data = url.includes('http')
      ? await download(url)
      : fs.readFileSync(url);

    const isCloud = mode == MODETYPE.CLOUD;
    // 创建文件夹
    const dirPath = path.join(
      this.app.getBaseDir(),
      '..',
      `public/${isCloud ? 'temp' : 'uploads'}/${moment().format('YYYYMMDD')}`
    );
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    const uuidStr = uuid();
    const name = `uploads/${moment().format('YYYYMMDD')}/${
      fileName ? fileName : uuidStr + extend
    }`;
    if (isCloud) {
      if (oss) {
        const ossClient: OSS = this.getMetaFileObj();
        return (await ossClient.put(name, data)).url;
      }
      if (cos) {
        const cosClient: COS = this.getMetaFileObj();
        await cosClient.putObject({
          Bucket: cos.bucket,
          Region: cos.region,
          Key: name,
          Body: data,
        });
        return cos.publicDomain + '/' + name;
      }
      if (qiniu) {
        let uploadToken = (await this.qiniu())['token'];
        const formUploader = new QINIU.form_up.FormUploader();
        const putExtra = new QINIU.form_up.PutExtra();
        return new Promise((resolve, reject) => {
          formUploader.put(
            uploadToken,
            name,
            data,
            putExtra,
            (respErr, respBody, respInfo) => {
              if (respErr) {
                throw respErr;
              }
              if (respInfo.statusCode == 200) {
                resolve(qiniu.publicDomain + '/' + name);
              }
            }
          );
        });
      }
    } else {
      fs.writeFileSync(
        `${dirPath}/${fileName ? fileName : uuidStr + extend}`,
        data
      );
      return `${domain}/public/${name}`;
    }
  }

  /**
   * 指定Key(路径)上传
   * @param file
   * @param key 路径一致会覆盖源文件
   */
  async uploadWithKey(file, key) {
    const { mode, oss, cos, qiniu } = this.config;
    const data = fs.readFileSync(file.data);
    if (mode == MODETYPE.LOCAL) {
      fs.writeFileSync(path.join(this.app.getBaseDir(), '..', key), data);
      return this.config.domain + key;
    }
    if (mode == MODETYPE.CLOUD) {
      if (oss) {
        const ossClient: OSS = this.getMetaFileObj();
        return (await ossClient.put(key, data)).url;
      }
      if (cos) {
        const cosClient: COS = this.getMetaFileObj();
        await cosClient.putObject({
          Bucket: cos.bucket,
          Region: cos.region,
          Key: key,
          Body: data,
        });
        return cos.publicDomain + '/' + key;
      }
      if (qiniu) {
        let uploadToken = (await this.qiniu())['token'];
        const formUploader = new QINIU.form_up.FormUploader();
        const putExtra = new QINIU.form_up.PutExtra();
        return new Promise((resolve, reject) => {
          formUploader.put(
            uploadToken,
            key,
            data,
            putExtra,
            (respErr, respBody, respInfo) => {
              if (respErr) {
                throw respErr;
              }
              if (respInfo.statusCode == 200) {
                resolve(qiniu.publicDomain + '/' + name);
              }
            }
          );
        });
      }
    }
  }

  /**
   * 上传文件
   * @param ctx
   * @param key 文件路径
   */
  async upload(ctx) {
    const { mode, oss, cos, qiniu } = this.config;
    if (mode == MODETYPE.LOCAL) {
      return await this.local(ctx);
    }
    if (mode == MODETYPE.CLOUD) {
      if (oss) {
        return await this.oss(ctx);
      }
      if (cos) {
        return await this.cos(ctx);
      }
      if (qiniu) {
        return await this.qiniu(ctx);
      }
    }
  }

  /**
   * 七牛上传
   * @param ctx
   * @returns
   */
  private async qiniu(ctx?) {
    const {
      bucket,
      publicDomain,
      region,
      uploadUrl = `https://upload-${region}.qiniup.com/`,
      fileKey = 'file',
    } = this.config.qiniu;
    let options = {
      scope: bucket,
    };
    const putPolicy = new QINIU.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(this.client);
    return new Promise((resolve, reject) => {
      resolve({
        uploadUrl,
        publicDomain,
        token: uploadToken,
        fileKey,
      });
    });
  }

  /**
   * OSS 文件上传
   * @param ctx
   */
  private async oss(ctx) {
    const {
      accessKeyId,
      accessKeySecret,
      bucket,
      endpoint,
      expAfter = 300000,
      maxSize = 200 * 1024 * 1024,
    } = this.config.oss;
    const oss = {
      bucket,
      region: endpoint.split('.')[0], // 我的是 hangzhou
      accessKeyId,
      accessKeySecret,
      expAfter, // 签名失效时间，毫秒
      maxSize, // 文件最大的 size
    };
    const host = `https://${bucket}.${endpoint}`;
    const expireTime = new Date().getTime() + oss.expAfter;
    const expiration = new Date(expireTime).toISOString();
    const policyString = JSON.stringify({
      expiration,
      conditions: [
        ['content-length-range', 0, oss.maxSize], // 设置上传文件的大小限制,200mb
      ],
    });
    const policy = Buffer.from(policyString).toString('base64');

    const signature = crypto
      .createHmac('sha1', oss.accessKeySecret)
      .update(policy)
      .digest('base64');

    return {
      signature,
      policy,
      host,
      OSSAccessKeyId: accessKeyId,
      success_action_status: 200,
    };
  }

  /**
   * COS 文件上传
   * @param ctx
   */
  private async cos(ctx) {
    const {
      accessKeyId,
      accessKeySecret,
      bucket,
      region,
      publicDomain,
      durationSeconds = 1800,
      allowPrefix = '_ALLOW_DIR_/*',
      allowActions = [
        // 所有 action 请看文档 https://cloud.tencent.com/document/product/436/31923
        // 简单上传
        'name/cos:PutObject',
        'name/cos:PostObject',
        // 分片上传
        'name/cos:InitiateMultipartUpload',
        'name/cos:ListMultipartUploads',
        'name/cos:ListParts',
        'name/cos:UploadPart',
        'name/cos:CompleteMultipartUpload',
      ],
    } = this.config.cos;
    // 配置参数
    let config = {
      secretId: accessKeyId,
      secretKey: accessKeySecret,
      durationSeconds,
      bucket: bucket,
      region: region,
      // 允许操作（上传）的对象前缀，可以根据自己网站的用户登录态判断允许上传的目录，例子： user1/* 或者 * 或者a.jpg
      // 请注意当使用 * 时，可能存在安全风险，详情请参阅：https://cloud.tencent.com/document/product/436/40265
      allowPrefix,
      // 密钥的权限列表
      allowActions,
    };

    // 获取临时密钥
    let LongBucketName = config.bucket;
    let ShortBucketName = LongBucketName.substring(
      0,
      LongBucketName.lastIndexOf('-')
    );
    let AppId = LongBucketName.substring(LongBucketName.lastIndexOf('-') + 1);

    let policy = {
      version: '2.0',
      statement: [
        {
          action: config.allowActions,
          effect: 'allow',
          resource: [
            'qcs::cos:' +
              config.region +
              ':uid/' +
              AppId +
              ':prefix//' +
              AppId +
              '/' +
              ShortBucketName +
              '/' +
              config.allowPrefix,
          ],
        },
      ],
    };

    return new Promise((resolve, reject) => {
      STS.getCredential(
        {
          secretId: config.secretId,
          secretKey: config.secretKey,
          durationSeconds: config.durationSeconds,
          policy: policy,
        },
        (err, tempKeys) => {
          if (err) {
            reject(err);
          }
          if (tempKeys) {
            tempKeys.startTime = Math.round(Date.now() / 1000);
          }
          resolve({
            ...tempKeys,
            url: publicDomain,
          });
        }
      );
    });
  }

  /**
   * 本地上传
   * @param ctx
   * @returns
   */
  private async local(ctx) {
    try {
      const { key } = ctx.fields;
      if (_.isEmpty(ctx.files)) {
        throw new CoolCommException('上传文件为空');
      }
      const file = ctx.files[0];
      const extension = file.filename.split('.').pop();
      const name =
        moment().format('YYYYMMDD') + '/' + (key || `${uuid()}.${extension}`);
      const target = path.join(
        this.app.getBaseDir(),
        '..',
        `public/uploads/${name}`
      );
      const dirPath = path.join(
        this.app.getBaseDir(),
        '..',
        `public/uploads/${moment().format('YYYYMMDD')}`
      );
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }
      const data = fs.readFileSync(file.data);
      fs.writeFileSync(target, data);
      return this.config.domain + '/public/uploads/' + name;
    } catch (err) {
      this.coreLogger.error(err);
      throw new CoolCommException('上传失败');
    }
  }
}
