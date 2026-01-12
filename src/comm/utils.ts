import { Inject, Provide, Scope, ScopeEnum } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import * as moment from 'moment';
import * as path from 'path';

/**
 * 工具类
 * 
 * 【设计模式注释】
 * 1. 单例模式 (Singleton Pattern): 使用 @Scope(ScopeEnum.Singleton) 确保全局唯一实例
 * 2. 依赖注入模式 (Dependency Injection Pattern): 通过 @Inject 等装饰器注入依赖
 * 
 * 【算法实现注释】
 * 1. IP获取算法: 从请求头中解析客户端IP地址
 * 2. URL匹配算法: 实现复杂的URL模式匹配功能
 * 3. JSON提取算法: 从文本中提取JSON结构
 * 4. 日期处理算法: 各种日期范围和间隔计算
 * 5. 驼峰转换算法: 下划线命名转驼峰命名
 * 
 * 【代码规范注释】
 * 1. 命名规范: 遵循camelCase命名约定
 * 2. 函数职责: 每个方法专注于单一功能
 * 3. 参数校验: 对输入参数进行必要验证
 * 4. 错误处理: 适当处理异常情况
 */
@Provide()
@Scope(ScopeEnum.Singleton)
export class Utils {
  @Inject()
  baseDir;

  /**
   * 获得dist路径
   */
  getDistPath() {
    const runPath = __dirname;
    const distIndex =
      runPath.lastIndexOf('/dist/') !== -1
        ? runPath.lastIndexOf('/dist/')
        : runPath.lastIndexOf('\\dist\\');
    if (distIndex !== -1) {
      return path.join(runPath.substring(0, distIndex), 'dist');
    }
    return path.join(runPath, 'dist');
  }

  /**
   * 获得请求IP
   * 
   * 【算法实现注释】
   * IP获取算法: 依次尝试从不同请求头获取客户端真实IP地址
   * 1. 优先获取 x-forwarded-for 头部（代理服务器转发的原始IP）
   * 2. 其次获取 socket remoteAddress（直接连接IP）
   * 3. 移除IPv6兼容性前缀 '::ffff:'
   * 
   * @param ctx Koa上下文对象
   * @returns 客户端IP地址字符串
   */
  async getReqIP(ctx: Context) {
    const req = ctx.req;
    // 【算法实现-IP获取算法】按优先级获取客户端IP地址
    return (
      req.headers['x-forwarded-for'] ||  // 代理服务器转发的原始IP
      req.socket.remoteAddress?.replace('::ffff:', '') ||  // 直接连接IP，移除IPv6兼容性前缀
      ''
    );
  }

  /**
   * 去除对象的空值属性
   * 
   * 【算法实现注释】
   * 空值清理算法: 遍历对象属性并删除空值（null、空字符串、undefined字符串）
   * 
   * @param obj 待处理的对象
   */
  async removeEmptyP(obj) {
    // 【算法实现-对象遍历算法】遍历对象的所有键
    Object.keys(obj).forEach(key => {
      // 【算法实现-空值判断算法】检查属性值是否为空值
      if (obj[key] === null || obj[key] === '' || obj[key] === 'undefined') {
        // 【算法实现-属性删除算法】删除空值属性
        delete obj[key];
      }
    });
  }

  /**
   * 线程阻塞毫秒数
   * @param ms
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 获得最近几天的日期集合
   * @param recently
   */
  getRecentlyDates(recently, format = 'YYYY-MM-DD') {
    moment.locale('zh-cn');
    const dates = [];
    for (let i = 0; i < recently; i++) {
      dates.push(moment().subtract(i, 'days').format(format));
    }
    return dates.reverse();
  }
  /**
   * 获得最近几个月的月数
   * @param recently
   */
  getRecentlyMonths(recently, format = 'YYYY-MM') {
    moment.locale('zh-cn');
    const dates = [];
    const date = moment(Date.now()).format('YYYY-MM');
    for (let i = 0; i < recently; i++) {
      dates.push(moment(date).subtract(i, 'months').format(format));
    }
    return dates.reverse();
  }

  /**
   * 根据开始和结束时间，获得时间段内的日期集合
   * @param start
   * @param end
   */
  getBetweenDays(start, end, format = 'YYYY-MM-DD') {
    moment.locale('zh-cn');
    const dates = [];
    const startTime = moment(start).format(format);
    const endTime = moment(end).format(format);
    const days = moment(endTime).diff(moment(startTime), 'days');
    for (let i = 0; i <= days; i++) {
      dates.push(moment(startTime).add(i, 'days').format(format));
    }
    return dates;
  }

  /**
   * 根据开始和结束时间，获得时间段内的月份集合
   * @param start
   * @param end
   */
  getBetweenMonths(start, end, format = 'YYYY-MM') {
    moment.locale('zh-cn');
    const dates = [];
    const startTime = moment(start).format(format);
    const endTime = moment(end).format(format);
    const months = moment(endTime).diff(moment(startTime), 'months');
    for (let i = 0; i <= months; i++) {
      dates.push(moment(startTime).add(i, 'months').format(format));
    }
    return dates;
  }

  /**
   * 根据开始和结束时间，获得时间段内的小时集合
   * @param start
   * @param end
   */
  getBetweenHours(start, end, format = 'YYYY-MM-DD HH') {
    moment.locale('zh-cn');
    const dates = [];
    const startTime = moment(start).format(format);
    const endTime = moment(end).format(format);
    const hours = moment(endTime).diff(moment(startTime), 'hours');
    for (let i = 0; i <= hours; i++) {
      dates.push(moment(startTime).add(i, 'hours').format(format));
    }
    return dates;
  }

  /**
   * 字段转驼峰法
   * @param obj
   * @returns
   */
  toCamelCase(obj) {
    const camelCaseObject = {};
    for (const i in obj) {
      const camelCase = i.replace(/([-_][a-z])/gi, $1 => {
        return $1.toUpperCase().replace('-', '').replace('_', '');
      });
      camelCaseObject[camelCase] = obj[i];
    }
    return camelCaseObject;
  }

  /**
   * 匹配URL
   * 
   * 【算法实现注释】
   * 高级URL匹配算法: 支持多种匹配模式的URL路径匹配
   * 1. 精确匹配: 直接比较路径段
   * 2. 单段通配符: '*' 匹配任意非空路径段
   * 3. 多段通配符: '**' 匹配剩余所有路径段
   * 4. 参数占位符: ':param' 匹配任意非空参数值
   * 
   * 【时间复杂度】O(n)，其中n为路径段数量
   * 【空间复杂度】O(n)，用于存储分割后的路径数组
   * 
   * @param pattern URL匹配模式
   * @param url 待匹配的URL
   * @returns 匹配结果布尔值
   */
  matchUrl(pattern, url) {
    // 【算法实现-路径分割算法】将模式和URL按'/'分割为路径段数组
    const patternParts = pattern.split('/').filter(Boolean);
    const urlParts = url.split('/').filter(Boolean);
    
    // 【算法实现-长度预检算法】如果长度不匹配且没有多段通配符，则直接返回false
    if (patternParts.length !== urlParts.length && !pattern.includes('**')) {
      return false;
    }
    
    // 【算法实现-逐段匹配算法】逐个比较路径段
    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const urlPart = urlParts[i];
      
      // 【算法实现-多段通配符算法】'**'匹配剩余所有路径段
      if (patternPart === '**') {
        return true;
      }
      
      // 【算法实现-参数占位符算法】':param'匹配任意非空参数值
      if (patternPart.startsWith(':')) {
        if (!urlPart) {
          return false;
        }
        continue;
      }
      
      // 【算法实现-单段通配符算法】'*'匹配任意非空路径段
      if (patternPart === '*') {
        if (!urlPart) {
          return false;
        }
      } else if (patternPart !== urlPart) {
        // 【算法实现-精确匹配算法】非通配符情况下必须完全匹配
        return false;
      }
    }
    
    // 【算法实现-最终验证算法】确认路径段数量匹配
    return patternParts.length === urlParts.length;
  }

  /**
   * 从文本中提取 JSON 字符串并转换为对象
   * 
   * 【算法实现注释】
   * 智能JSON提取算法: 能够从混合文本中准确提取JSON结构
   * 1. 首先尝试直接解析整个文本
   * 2. 如果失败，则搜索可能的JSON起始位置（{ 或 [）
   * 3. 从每个起始位置开始，使用括号平衡算法寻找完整JSON结构
   * 4. 特殊处理字符串中的括号（通过转义字符检测）
   * 
   * 【时间复杂度】O(n²)，最坏情况下需要从每个可能位置开始扫描
   * 【空间复杂度】O(n)，用于存储可能的起始位置
   * 
   * @param {string} text - 可能包含 JSON 的文本
   * @returns {Object|Array|null} - 解析出的 JSON 对象，如果没有找到有效 JSON 则返回 null
   */
  extractJSONFromText(text) {
    // 【算法实现-输入校验算法】检查输入是否为有效字符串
    if (!text || typeof text !== 'string') {
      return null;
    }

    try {
      // 【算法实现-快速匹配算法】尝试直接解析整个文本
      return JSON.parse(text);
    } catch (e) {
      // 整个文本不是有效的 JSON，尝试提取 JSON 部分
    }

    // 【算法实现-起始位置搜索算法】查找所有可能的JSON起始位置（{ 或 [）
    const possibleStarts = [];
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '{' || text[i] === '[') {
        possibleStarts.push(i);
      }
    }

    // 【算法实现-括号平衡算法】从每个可能的起始位置尝试提取完整的JSON结构
    for (const startIndex of possibleStarts) {
      // 【算法变量】跟踪大括号和中括号的嵌套层级
      let openBraces = 0;      // 跟踪 { } 的数量
      let openBrackets = 0;    // 跟踪 [ ] 的数量
      let inString = false;    // 跟踪是否在字符串内部
      let escapeNext = false;  // 跟踪下一个字符是否被转义

      // 【算法实现-字符扫描算法】从起始位置开始逐字符扫描
      for (let i = startIndex; i < text.length; i++) {
        const char = text[i];

        // 【算法实现-转义字符处理算法】处理反斜杠转义
        if (inString && !escapeNext && char === '\\') {
          escapeNext = true;
          continue;
        }

        // 【算法实现-字符串边界检测算法】检测字符串开始/结束
        if (!escapeNext && char === '"') {
          inString = !inString;
        }

        // 【算法实现-括号计数算法】只在非字符串内部时统计括号
        if (!inString) {
          if (char === '{') openBraces++;        // 遇到 { 增加计数
          else if (char === '}') openBraces--;   // 遇到 } 减少计数
          else if (char === '[') openBrackets++;  // 遇到 [ 增加计数
          else if (char === ']') openBrackets--; // 遇到 ] 减少计数
        }

        escapeNext = false;

        // 【算法实现-完整性验证算法】检查是否找到完整的JSON结构
        if (
          // 完整的对象结构：起始为{，当前为}，大括号计数归零
          (openBraces === 0 && text[startIndex] === '{' && char === '}') ||
          // 完整的数组结构：起始为[，当前为]，中括号计数归零
          (openBrackets === 0 && text[startIndex] === '[' && char === ']')
        ) {
          // 【算法实现-子串提取算法】提取完整的JSON字符串
          const jsonStr = text.substring(startIndex, i + 1);
          
          // 【算法实现-二次验证算法】尝试解析提取的JSON字符串
          try {
            const result = JSON.parse(jsonStr);
            return result;
          } catch (e) {
            // 这个候选 JSON 无效，继续尝试下一个可能的起始位置
            break;
          }
        }
      }
    }

    return null; // 没有找到有效的 JSON
  }
}
