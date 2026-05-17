/*
 Copyright © 2024-2026 Juzi Video. All rights reserved.
 版权所有 © 2024-2026 橘子视频。保留所有权利。
 作者：xiaoliwanshui
 邮箱：chocolaer@126.com


 ============================================================================
                                版权声明
 ============================================================================


 本软件（以下简称"本软件"）受中华人民共和国著作权法及国际著作权条约保护。


 【版权人】橘子视频 (Juzi Video)
 【权利范围】本软件的全部源代码、二进制文件、文档及相关材料


 ============================================================================
                                许可证协议
 ============================================================================


 本软件仅授权用户进行以下操作：


  ✓ 可免费试用：下载并运行本软件，仅限个人非商业用途
  ✓ 可学习研究：查看和学习本软件源代码，仅供个人研究


 ============================================================================
                                禁止事项
 ============================================================================


  ✗ 禁止商业使用：未经授权，不得对本软件进行销售、授权、出租或商业利用
  ✗ 禁止修改演绎：未经授权，不得对本软件进行修改、反向工程或创作衍生作品
  ✗ 禁止分发传播：未经授权，不得以任何形式向第三方分发或公开本软件
  ✗ 禁止删除版权：不得移除或篡改本软件中的任何版权声明或知识产权标识


 ============================================================================
                                免责声明
 ============================================================================


 本软件按"原样"提供，不提供任何明示或暗示的保证，包括但不限于：
 对适销性、特定用途适用性、非侵权性的保证。在任何情况下，
 版权持有人均不对因使用本软件而产生的任何索赔、损害或损失承担责任。


 ============================================================================
                                终止条款
 ============================================================================


 若您违反本协议的任何条款，本许可证将自动终止。
 终止后，您必须立即停止使用本软件，并销毁所有相关副本。


 ============================================================================
                                法律适用
 ============================================================================


 本协议受中华人民共和国法律管辖，并按其解释。


 ============================================================================
                                联系我们
 ============================================================================


 如需商业授权或其他合作事宜，请联系版权方。


 ---


 本软件受著作权法和国际条约保护。
 未经授权的复制、修改、分发或商业使用将被追究法律责任。
*/

import { App, ILogger, Inject, IMidwayApplication, Provide } from '@midwayjs/core';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const TAG = 'NetworkErrorHandler';

@Provide()
export class NetworkErrorHandler {
  @Inject()
  logger: ILogger;

  @App()
  app: IMidwayApplication;

  private readonly maxConcurrentRequests = 4;
  private pendingRequests = 0;
  private readonly requestQueue: Array<() => void> = [];
  private axiosClient: AxiosInstance = axios.create();

  /**
   * 判断是否为网络相关错误
   */
  isNetworkError(error: any): boolean {
    if (error.isAxiosError) {
      const axiosError = error as AxiosError;
      // DNS解析失败
      if (axiosError.code === 'ENOTFOUND') {
        return true;
      }
      // 连接超时
      if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
        return true;
      }
      // 连接被拒绝
      if (axiosError.code === 'ECONNREFUSED') {
        return true;
      }
      // 网络不可达
      if (axiosError.code === 'ENETUNREACH') {
        return true;
      }
      // SSL/TLS相关错误
      if (axiosError.code === 'DEPTH_ZERO_SELF_SIGNED_CERT' || 
          axiosError.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
        return true;
      }
    }
    return false;
  }

  /**
   * 判断是否为DNS解析错误
   */
  isDnsError(error: any): boolean {
    return error.isAxiosError && error.code === 'ENOTFOUND';
  }

  /**
   * 判断是否为超时错误
   */
  isTimeoutError(error: any): boolean {
    return error.isAxiosError && 
           (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT');
  }

  /**
   * 带重试的网络请求
   */
  async requestWithRetry(
    config: AxiosRequestConfig,
    maxRetries: number = 3,
    retryDelay: number = 1000
  ): Promise<AxiosResponse> {
    if (!config) {
      throw new Error('请求配置不能为空');
    }

    if (!config.url) {
      throw new Error('请求URL不能为空');
    }

    return new Promise((resolve, reject) => {
      const task = () => {
        this.runInBackground(async () => {
          try {
            const response = await this.executeRequest(config, maxRetries, retryDelay);
            resolve(response);
          } catch (error) {
            reject(error);
          } finally {
            this.pendingRequests--;
            this.processQueue();
          }
        });
      };

      if (this.pendingRequests < this.maxConcurrentRequests) {
        this.pendingRequests++;
        task();
      } else {
        this.requestQueue.push(() => {
          this.pendingRequests++;
          task();
        });
      }
    });
  }

  /**
   * 检查URL是否可访问
   */
  async checkUrlAvailability(url: string): Promise<boolean> {
    if (!url || typeof url !== 'string') {
      this.logger.warn(TAG, 'URL不能为空且必须是字符串');
      return false;
    }

    if (!url.startsWith('http')) {
      this.logger.warn(TAG, `URL必须以http开头: ${url}`);
      return false;
    }

    return new Promise(resolve => {
      const task = () => {
        this.runInBackground(async () => {
          try {
            await this.axiosClient.head(url, { timeout: 5000 });
            resolve(true);
          } catch (error) {
            this.logger.warn(TAG, `URL不可访问: ${url} - ${error.message}`);
            resolve(false);
          } finally {
            this.pendingRequests--;
            this.processQueue();
          }
        });
      };

      if (this.pendingRequests < this.maxConcurrentRequests) {
        this.pendingRequests++;
        task();
      } else {
        this.requestQueue.push(() => {
          this.pendingRequests++;
          task();
        });
      }
    });
  }

  /**
   * 获取网络错误的详细信息
   */
  getNetworkErrorDetails(error: any): string {
    if (!error) {
      return '未知错误';
    }

    if (!error.isAxiosError) {
      return `未知错误: ${error.message || String(error)}`;
    }

    const axiosError = error as AxiosError;
    switch (axiosError.code) {
      case 'ENOTFOUND':
        return `DNS解析失败: 无法解析域名 ${axiosError.config?.url}`;
      case 'ECONNABORTED':
      case 'ETIMEDOUT':
        return `请求超时: ${axiosError.config?.url}`;
      case 'ECONNREFUSED':
        return `连接被拒绝: ${axiosError.config?.url}`;
      case 'ENETUNREACH':
        return `网络不可达: ${axiosError.config?.url}`;
      case 'DEPTH_ZERO_SELF_SIGNED_CERT':
        return `SSL证书错误: 自签名证书 ${axiosError.config?.url}`;
      case 'UNABLE_TO_VERIFY_LEAF_SIGNATURE':
        return `SSL证书验证失败: ${axiosError.config?.url}`;
      default:
        return `网络错误 (${axiosError.code}): ${axiosError.message}`;
    }
  }

  /**
   * 休眠指定毫秒数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 为采集源配置axios默认参数
   */
  getCollectionAxiosConfig(): AxiosRequestConfig {
    return {
      timeout: 30000, // 30秒超时
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
      },
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 300,
    };
  }

  private async executeRequest(
    config: AxiosRequestConfig,
    maxRetries: number,
    retryDelay: number
  ): Promise<AxiosResponse> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.debug(TAG, `尝试请求 ${config.url}, 第${attempt}次`);
        const response = await this.axiosClient.request(config);
        this.logger.debug(TAG, `请求成功: ${config.url}`);
        return response;
      } catch (error) {
        lastError = error;

        if (this.isNetworkError(error)) {
          if (this.isDnsError(error)) {
            this.logger.warn(TAG, `DNS解析失败 ${config.url}: ${error.message}, 第${attempt}次尝试`);
          } else if (this.isTimeoutError(error)) {
            this.logger.warn(TAG, `请求超时 ${config.url}: ${error.message}, 第${attempt}次尝试`);
          } else {
            this.logger.warn(TAG, `网络错误 ${config.url}: ${error.message}, 第${attempt}次尝试`);
          }

          if (attempt < maxRetries) {
            const delay = retryDelay * Math.pow(2, attempt - 1);
            this.logger.info(TAG, `等待${delay}ms后重试...`);
            await this.sleep(delay);
            continue;
          }
        } else {
          this.logger.error(TAG, `非网络错误，不重试: ${error.message}`);
          throw error;
        }
      }
    }

    this.logger.error(TAG, `请求最终失败 ${config.url}, 已重试${maxRetries}次: ${lastError?.message}`);
    throw lastError;
  }

  private processQueue() {
    if (this.pendingRequests >= this.maxConcurrentRequests) {
      return;
    }
    const next = this.requestQueue.shift();
    if (next) {
      next();
    }
  }

  private runInBackground(task: () => Promise<void>) {
    const runner = this.app as unknown as { runInBackground?: (fn: () => Promise<void>) => void };
    const runBackground =
      typeof runner?.runInBackground === 'function'
        ? runner.runInBackground.bind(runner)
        : (fn: () => Promise<void>) => setImmediate(fn);
    runBackground(task);
  }
}