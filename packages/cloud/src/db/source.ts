import { DataSource } from 'typeorm';

export class CoolDataSource extends DataSource {
  /**
   * 重新构造元数据
   */
  async buildMetadatas() {
    await super.buildMetadatas();
  }
}
