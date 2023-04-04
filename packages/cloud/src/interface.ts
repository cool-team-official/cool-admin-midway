/**
 * 云函数请求
 */
export interface CloudReq {
  // 云函数名称
  name: string;
  // 请求参数
  params: any;
  // 调用方法
  method: string;
}
