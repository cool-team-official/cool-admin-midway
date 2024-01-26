import { CoolController, BaseController } from '@cool-midway/core';
import { PluginService } from '../../../plugin/service/info';
import { Get, Inject } from '@midwayjs/core';

/**
 * 插件
 */
@CoolController()
export class OpenDemoPluginController extends BaseController {
  @Inject()
  pluginService: PluginService;

  @Get('/invoke', { summary: '调用插件' })
  async invoke() {
    const result = await this.pluginService.invoke('test', 'show', 1, 2);
    return this.ok(result);
  }
}
