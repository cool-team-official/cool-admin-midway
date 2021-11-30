import { Body, Get, Inject, Post, Provide, Query } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import { BasePluginInfoService } from '../../../service/plugin/info';

/**
 * 插件
 */
@Provide()
@CoolController()
export class BasePluginInfoController extends BaseController {
  @Inject()
  basePluginInfoService: BasePluginInfoService;
  /**
   * 插件列表
   */
  @Post('/list', { summary: '列表' })
  async list(@Body() keyWord: string) {
    return this.ok(await this.basePluginInfoService.list(keyWord));
  }

  /**
   * 配置
   * @param namespace
   * @param config
   */
  @Post('/config', { summary: '配置' })
  async config(@Body() namespace: string, @Body() config: any) {
    await this.basePluginInfoService.config(namespace, config);
    return this.ok();
  }

  /**
   * 配置
   * @param namespace
   * @param config
   */
  @Get('/getConfig', { summary: '获得配置' })
  async getConfig(@Query() namespace: string) {
    return this.ok(await this.basePluginInfoService.getConfig(namespace));
  }

  /**
   * 启用插件
   * @param enable
   */
  @Post('/enable', { summary: '启用|禁用' })
  async enable(@Body() namespace: string, @Body() enable: number) {
    await this.basePluginInfoService.enable(namespace, enable);
    return this.ok();
  }
}
