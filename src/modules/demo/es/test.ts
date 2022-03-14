import { CoolEsIndex, ICoolEs, BaseEsIndex } from '@cool-midway/es';

/**
 * 测试索引
 */
@CoolEsIndex('test')
export class TestEsIndex extends BaseEsIndex implements ICoolEs {
  indexInfo() {
    return {
      name: {
        type: 'text',
      },
      age: {
        type: 'long',
      },
    };
  }
}
