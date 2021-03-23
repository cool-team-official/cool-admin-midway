import { Provide } from '@midwayjs/decorator';
import { BaseService } from 'midwayjs-cool-core';
/**
 * 任务执行的demo示例
 */
@Provide()
export class DemoTaskService extends BaseService {
  /**
   * 测试任务执行
   * @param params 接收的参数 数组 [] 可不传
   */
  async test(params?: []) {
    // 需要登录后台任务管理配置任务
    console.log('任务执行了', params);
  }
}
