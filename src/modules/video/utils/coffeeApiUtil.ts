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

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Coffee API 专用工具类
 * 用于请求 https://coffee.1ljx.com:32000/api/ 接口
 */
export class CoffeeApiUtil {
  private static instance: CoffeeApiUtil;
  private axiosClient: AxiosInstance;
  private readonly baseUrl: string = 'https://coffee.1ljx.com:32000/api/';
  private readonly defaultKey: string = '87d8f0f690af69b89650d581e99125b1';
  private readonly timeout: number = 30000;

  private constructor() {
    this.initAxiosClient();
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): CoffeeApiUtil {
    if (!CoffeeApiUtil.instance) {
      CoffeeApiUtil.instance = new CoffeeApiUtil();
    }
    return CoffeeApiUtil.instance;
  }

  /**
   * 初始化 Axios 客户端
   */
  private initAxiosClient(): void {
    this.axiosClient = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      validateStatus: (status) => status >= 200 && status < 300,
    });
  }

  /**
   * 构建完整的请求URL
   * @param key API密钥
   * @param url 参数URL
   * @returns 完整的请求URL
   */
  private buildUrl(key: string, url: string): string {
    return `?key=${encodeURIComponent(key)}&url=${encodeURIComponent(url)}`;
  }

  /**
   * 基础GET请求方法
   * @param url 请求的URL参数
   * @param key API密钥（可选）
   * @param options 额外的请求选项
   */
  async get(
    url: string,
    key?: string,
    options?: Partial<AxiosRequestConfig>
  ): Promise<AxiosResponse<any>> {
    const apiKey = key || this.defaultKey;
    const requestUrl = this.buildUrl(apiKey, url);
    
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: requestUrl,
      ...options
    };

    return await this.axiosClient.request(config);
  }

  /**
   * POST请求方法
   * @param url 请求的URL参数
   * @param data 请求体数据
   * @param key API密钥（可选）
   * @param options 额外的请求选项
   */
  async post(
    url: string,
    data?: any,
    key?: string,
    options?: Partial<AxiosRequestConfig>
  ): Promise<AxiosResponse<any>> {
    const apiKey = key || this.defaultKey;
    const requestUrl = this.buildUrl(apiKey, url);
    
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: requestUrl,
      data,
      ...options
    };

    return await this.axiosClient.request(config);
  }

  /**
   * HEAD请求方法（用于检查URL可用性）
   * @param url 请求的URL参数
   * @param key API密钥（可选）
   */
  async head(url: string, key?: string): Promise<boolean> {
    const apiKey = key || this.defaultKey;
    const requestUrl = this.buildUrl(apiKey, url);
    
    try {
      await this.axiosClient.head(requestUrl, { timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

}