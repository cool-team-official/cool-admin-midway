import { Provide } from '@midwayjs/decorator';
import { BaseService } from 'midwayjs-cool-core';
/**
 * 描述
 */
@Provide()
export class DemoTaskService extends BaseService {
  /**
   * 测试任务执行
   */
  async test() {
    // 需要登录后台任务管理配置任务
    console.log('任务执行了');
  }
}
