import { CoolUrlTagConfig } from './../decorator/tag';
import {
  CONTROLLER_KEY,
  getClassMetadata,
  Init,
  listModule,
  Provide,
  Scope,
  ScopeEnum,
} from '@midwayjs/decorator';
import { COOL_URL_TAG_KEY } from '../decorator/tag';
import * as _ from 'lodash';

/**
 * URL标签
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class CoolUrlTagData {
  data = {};
  @Init()
  async init() {
    const tags = listModule(COOL_URL_TAG_KEY);
    for (const controller of tags) {
      const controllerOption = getClassMetadata(CONTROLLER_KEY, controller);
      const tagOption: CoolUrlTagConfig = getClassMetadata(
        COOL_URL_TAG_KEY,
        controller
      );
      const data: string[] = this.data[tagOption.key] || [];
      this.data[tagOption.key] = _.uniq(data.concat(
        tagOption.value.map(e => {
          return controllerOption.prefix + '/' + e;
        }))
      );
    }
  }

  /**
   * 根据键获得
   * @param key
   * @returns
   */
  byKey(key: string): string[] {
    return this.data[key];
  }
}
