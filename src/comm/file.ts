import { PluginService } from '@/modules/plugin/service/info';
import { Inject, Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { Mode } from '../../typings/upload';

/**
 * 文件上传下载
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class FileService {
  @Inject()
  pluginService: PluginService;
  async upload(ctx) {
    const file = await this.pluginService.getInstance('upload');
    return file.upload(ctx);
  }

  /**
   * 上传文件，兼容插件 upload 逻辑
   * @param path
   * @param buffer 文件内容 buffer
   * @param key 可选，文件保存路径 key
   */
  async uploadFile(path: string, buffer: ArrayBufferLike, key?: string) {
    const filename = require('path').basename(path);
    // 构建 ctx，data 字段为 buffer
    const ctx = {
      files: [
        {
          filename,
          data: Buffer.from(buffer),
        },
      ],
      fields: {
        key: key || '',
        path,
      },
    };
    return await this.upload(ctx);
  }

  async uploadWithKey(filePath, key) {
    const file = await this.pluginService.getInstance('upload');
    return file.uploadWithKey(filePath, key);
  }

  async downAndUpload(path: string, fileName?: string): Promise<string> {
    const file = await this.pluginService.getInstance('upload');
    return await file.downAndUpload(path, fileName);
  }

  async getMode(): Promise<Mode> {
    const file = await this.pluginService.getInstance('upload');
    return await file.getMode();
  }
}
