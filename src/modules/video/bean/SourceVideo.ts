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

/**
 * @Author: 17691002584 17691002584@163.com
 * @Date: 2025-06-19 18:13:15
 * @LastEditors: 17691002584 17691002584@163.com
 * @LastEditTime: 2025-07-20 13:35:58
 * @FilePath: src/modules/video/bean/SourceVideo.ts
 * @Description: 这是默认设置,可以在设置》工具》File Description中进行配置
 */
export interface VideoResponseData {
  code: number;
  msg: string;
  page: number;
  pagecount: number;
  limit: string; // 注意：limit 是一个字符串，即使它看起来像数字
  total: number;
  list: any[]; // 假设 list 是一个数组，包含任意类型的元素
}

export interface SourceVideo {
  group_id?: number;
  type_id?: number;
  type_id_1?: number;
  type_name?: string;
  vod_actor?: string;
  vod_area?: string;
  vod_author?: string;
  vod_behind?: string;
  vod_blurb?: string;
  vod_class?: string;
  vod_color?: string;
  vod_content?: string;
  vod_copyright?: number;
  vod_director?: string;
  vod_douban_id?: number;
  vod_douban_score?: string;
  vod_down?: number;
  vod_down_from?: string;
  vod_down_note?: string;
  vod_down_server?: string;
  vod_down_url?: string;
  vod_duration?: string;
  vod_en?: string;
  vod_hits?: number;
  vod_hits_day?: number;
  vod_hits_month?: number;
  vod_hits_week?: number;
  vod_id?: number;
  vod_isend?: number;
  vod_jumpurl?: string;
  vod_lang?: string;
  vod_letter?: string;
  vod_level?: number;
  vod_lock?: number;
  vod_name?: string;
  vod_pic?: string;
  vod_pic_screenshot?: string | null;
  vod_pic_slide?: string;
  vod_pic_thumb?: string;
  vod_play_from?: string;
  vod_play_note?: string;
  vod_play_server?: string;
  vod_play_url?: string;
  vod_plot?: number;
  vod_plot_detail?: string;
  vod_plot_name?: string;
  vod_points?: number;
  vod_points_down?: number;
  vod_points_play?: number;
  vod_pubdate?: string;
  vod_pwd?: string;
  vod_pwd_down?: string;
  vod_pwd_down_url?: string;
  vod_pwd_play?: string;
  vod_pwd_play_url?: string;
  vod_pwd_url?: string;
  vod_rel_art?: string;
  vod_rel_vod?: string;
  vod_remarks?: string;
  vod_reurl?: string;
  vod_score?: string;
  vod_score_all?: number;
  vod_score_num?: number;
  vod_serial?: string;
  vod_state?: string;
  vod_status?: number;
  vod_sub?: string;
  vod_tag?: string;
  vod_time?: string;
  vod_time_add?: number;
  vod_time_hits?: number;
  vod_time_make?: number;
  vod_total?: number;
  vod_tpl?: string;
  vod_tpl_down?: string;
  vod_tpl_play?: string;
  vod_trysee?: number;
  vod_tv?: string;
  vod_up?: number;
  vod_version?: string;
  vod_weekday?: string;
  vod_writer?: string;
  vod_year?: string;
}

export interface Line {
  name: string;
  file: string;
  sub_title: string;
  video_id: number;
  tag: string;
  sort: number;
  video_line_id: number;
  video_name: string;
  collection_id: number;
  collection_name: string;
}
