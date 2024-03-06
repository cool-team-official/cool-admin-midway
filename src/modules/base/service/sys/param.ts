import { Inject, InjectClient, Provide } from '@midwayjs/decorator';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Not, Repository } from 'typeorm';
import { BaseSysParamEntity } from '../../entity/sys/param';
import { CachingFactory, MidwayCache } from '@midwayjs/cache-manager';

/**
 * 参数配置
 */
@Provide()
export class BaseSysParamService extends BaseService {
  @InjectEntityModel(BaseSysParamEntity)
  baseSysParamEntity: Repository<BaseSysParamEntity>;

  @InjectClient(CachingFactory, 'default')
  midwayCache: MidwayCache;

  /**
   * 根据key获得对应的参数
   * @param key
   */
  async dataByKey(key) {
    let result: any = await this.midwayCache.get(`param:${key}`);
    if (!result) {
      result = await this.baseSysParamEntity.findOneBy({ keyName: key });
      this.midwayCache.set(`param:${key}`, result);
    }
    if (result) {
      if (result.dataType == 0) {
        try {
          return JSON.parse(result.data);
        } catch (error) {
          return result.data;
        }
      }
      if (result.dataType == 1) {
        return result.data;
      }
      if (result.dataType == 2) {
        return result.data.split(',');
      }
    }
    return;
  }

  /**
   * 根据key获得对应的网页数据
   * @param key
   */
  async htmlByKey(key) {
    let html = '<html><title>@title</title><body>@content</body></html>';
    let result: any = await this.midwayCache.get(`param:${key}`);
    if (result) {
      html = html
        .replace('@content', result.data)
        .replace('@title', result.name);
    } else {
      html = html.replace('@content', 'key notfound');
    }
    return html;
  }

  /**
   * 添加或者修改
   * @param param
   */
  async addOrUpdate(param: any, type): Promise<void> {
    const find = {
      keyName: param.keyName,
    };
    if (param.id) {
      find['id'] = Not(param.id);
    }
    const check = await this.baseSysParamEntity.findOneBy(find);
    if (check) {
      throw new CoolCommException('存在相同的keyName');
    }
    await super.addOrUpdate(param, type);
  }

  /**
   * 重新初始化缓存
   */
  async modifyAfter() {
    const params = await this.baseSysParamEntity.find();
    for (const param of params) {
      await this.midwayCache.set(`param:${param.keyName}`, param);
    }
  }
}
