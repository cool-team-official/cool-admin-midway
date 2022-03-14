import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { BaseSysParamEntity } from '../../entity/sys/param';
import { CacheManager } from '@midwayjs/cache';

/**
 * 参数配置
 */
@Provide()
export class BaseSysParamService extends BaseService {
  @InjectEntityModel(BaseSysParamEntity)
  baseSysParamEntity: Repository<BaseSysParamEntity>;

  @Inject()
  cacheManager: CacheManager;

  /**
   * 根据key获得对应的参数
   * @param key
   */
  async dataByKey(key) {
    let result: any = await this.cacheManager.get(`param:${key}`);
    if (!result) {
      result = await this.baseSysParamEntity.findOne({ keyName: key });
    }
    if (result) {
      if (typeof result == 'string') {
        result = JSON.parse(result);
      }
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
    let result: any = await this.cacheManager.get(`param:${key}`);
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
      await this.cacheManager.set(
        `param:${param.keyName}`,
        JSON.stringify(param)
      );
    }
  }
}
