import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService, ICoolCache } from 'midwayjs-cool-core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { BaseSysParamEntity } from '../../entity/sys/param';

/**
 * 参数配置
 */
@Provide()
export class BaseSysParamService extends BaseService {
  @InjectEntityModel(BaseSysParamEntity)
  baseSysParamEntity: Repository<BaseSysParamEntity>;

  @Inject('cool:cache')
  coolCache: ICoolCache;

  /**
   * 根据key获得对应的参数
   * @param key
   */
  async dataByKey(key) {
    let result = await this.coolCache.get(`param:${key}`);
    if (result) {
      result = JSON.parse(result);
      if (result.dataType !== 0) {
        return JSON.parse(result.data);
      } else {
        return result.data;
      }
    }
    return;
  }

  /**
   * 根据key获得对应的网页数据
   * @param key
   */
  async htmlByKey(key) {
    let html = '<html><body>@content</body></html>';
    let result = await this.coolCache.get(`param:${key}`);
    if (result) {
      result = JSON.parse(result);
      html = html.replace('@content', result.data);
    } else {
      html = html.replace('@content', 'key notfound');
    }
    return html;
  }

  /**
   * 重新初始化缓存
   */
  async modifyAfter() {
    const params = await this.baseSysParamEntity.find();
    for (const param of params) {
      await this.coolCache.set(`param:${param.keyName}`, JSON.stringify(param));
    }
  }
}
