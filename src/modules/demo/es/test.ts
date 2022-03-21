import { CoolEsIndex, ICoolEs, BaseEsIndex } from '@cool-midway/es';

/**
 * 测试索引
 */
@CoolEsIndex({ name: 'test', replicas: 0 })
export class TestEsIndex extends BaseEsIndex implements ICoolEs {
  indexInfo() {
    return {
      // 需要安装ik分词器 https://github.com/medcl/elasticsearch-analysis-ik
      name: {
        type: 'text',
        analyzer: 'ik_max_word',
        search_analyzer: 'ik_max_word',
        fields: {
          raw: {
            type: 'keyword',
          },
        },
      },
      age: {
        type: 'long',
      },
    };
  }
}
