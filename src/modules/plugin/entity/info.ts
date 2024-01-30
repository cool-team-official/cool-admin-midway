import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, DataSource, Index } from 'typeorm';

console.log(DataSource);

/**
 * 插件信息
 */
@Entity('plugin_info')
export class PluginInfoEntity extends BaseEntity {
  @Column({ comment: '名称' })
  name: string;

  @Column({ comment: '简介' })
  description: string;

  @Index()
  @Column({ comment: 'Key名' })
  keyName: string;

  @Column({ comment: 'Hook' })
  hook: string;

  @Column({ comment: '描述', type: 'text' })
  readme: string;

  @Column({ comment: '版本' })
  version: string;

  @Column({ comment: 'Logo(base64)', type: 'text', nullable: true })
  logo: string;

  @Column({ comment: '作者' })
  author: string;

  @Column({ comment: '状态 0-禁用 1-启用', default: 0 })
  status: number;

  @Column({ comment: '内容', type: 'json' })
  content: {
    type: 'comm' | 'module';
    data: string;
  };

  @Column({ comment: '插件的plugin.json', type: 'json', nullable: true })
  pluginJson: any;

  @Column({ comment: '配置', type: 'json', nullable: true })
  config: any;
}
