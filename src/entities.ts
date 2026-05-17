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

// 自动生成的文件，请勿手动修改
import * as entity0 from './modules/video/entity/week_video';
import * as entity1 from './modules/video/entity/week';
import * as entity2 from './modules/video/entity/video_rules';
import * as entity3 from './modules/video/entity/video_line';
import * as entity4 from './modules/video/entity/video_album_relationship';
import * as entity5 from './modules/video/entity/videos';
import * as entity6 from './modules/video/entity/swiper';
import * as entity7 from './modules/video/entity/play_line';
import * as entity8 from './modules/video/entity/player';
import * as entity9 from './modules/video/entity/live';
import * as entity10 from './modules/video/entity/hot_keyword';
import * as entity11 from './modules/video/entity/collection_category';
import * as entity12 from './modules/video/entity/collection';
import * as entity13 from './modules/video/entity/category';
import * as entity14 from './modules/video/entity/barrage';
import * as entity15 from './modules/video/entity/album';
import * as entity16 from './modules/user/entity/wx';
import * as entity17 from './modules/user/entity/views';
import * as entity18 from './modules/user/entity/share';
import * as entity19 from './modules/user/entity/like';
import * as entity20 from './modules/user/entity/info';
import * as entity21 from './modules/user/entity/contacts';
import * as entity22 from './modules/user/entity/collect';
import * as entity23 from './modules/user/entity/address';
import * as entity51 from './modules/user/entity/inviteCode';
import * as entity52 from './modules/user/entity/inviteRecord';
import * as entity24 from './modules/task/entity/log';
import * as entity25 from './modules/task/entity/info';
import * as entity26 from './modules/space/entity/type';
import * as entity27 from './modules/space/entity/info';
import * as entity28 from './modules/recycle/entity/data';
import * as entity29 from './modules/plugin/entity/info';
import * as entity30 from './modules/member/entity/score';
import * as entity31 from './modules/member/entity/monthlyCheckinConfig';
import * as entity32 from './modules/member/entity/memberExchangeConfig';
import * as entity33 from './modules/member/entity/member';
import * as entity53 from './modules/member/entity/scoreWithdrawal';
import * as entity34 from './modules/dict/entity/type';
import * as entity35 from './modules/dict/entity/info';
import * as entity36 from './modules/demo/entity/goods';
import * as entity37 from './modules/base/entity/base';
import * as entity38 from './modules/base/entity/sys/user_role';
import * as entity39 from './modules/base/entity/sys/user';
import * as entity40 from './modules/base/entity/sys/role_menu';
import * as entity41 from './modules/base/entity/sys/role_department';
import * as entity42 from './modules/base/entity/sys/role';
import * as entity43 from './modules/base/entity/sys/param';
import * as entity44 from './modules/base/entity/sys/menu';
import * as entity45 from './modules/base/entity/sys/log';
import * as entity46 from './modules/base/entity/sys/department';
import * as entity47 from './modules/base/entity/sys/conf';
import * as entity48 from './modules/application/entity/noticeInfo';
import * as entity49 from './modules/application/entity/feedbackInfo';
import * as entity50 from './modules/application/entity/ads';
import * as entity54 from './modules/cmsdatabase/entity/cmssqlLog';
export const entities = [
  ...Object.values(entity0),
  ...Object.values(entity1),
  ...Object.values(entity2),
  ...Object.values(entity3),
  ...Object.values(entity4),
  ...Object.values(entity5),
  ...Object.values(entity6),
  ...Object.values(entity7),
  ...Object.values(entity8),
  ...Object.values(entity9),
  ...Object.values(entity10),
  ...Object.values(entity11),
  ...Object.values(entity12),
  ...Object.values(entity13),
  ...Object.values(entity14),
  ...Object.values(entity15),
  ...Object.values(entity16),
  ...Object.values(entity17),
  ...Object.values(entity18),
  ...Object.values(entity19),
  ...Object.values(entity20),
  ...Object.values(entity21),
  ...Object.values(entity22),
  ...Object.values(entity23),
  ...Object.values(entity24),
  ...Object.values(entity25),
  ...Object.values(entity26),
  ...Object.values(entity27),
  ...Object.values(entity28),
  ...Object.values(entity29),
  ...Object.values(entity30),
  ...Object.values(entity31),
  ...Object.values(entity32),
  ...Object.values(entity33),
  ...Object.values(entity34),
  ...Object.values(entity35),
  ...Object.values(entity36),
  ...Object.values(entity37),
  ...Object.values(entity38),
  ...Object.values(entity39),
  ...Object.values(entity40),
  ...Object.values(entity41),
  ...Object.values(entity42),
  ...Object.values(entity43),
  ...Object.values(entity44),
  ...Object.values(entity45),
  ...Object.values(entity46),
  ...Object.values(entity47),
  ...Object.values(entity48),
  ...Object.values(entity49),
  ...Object.values(entity50),
  ...Object.values(entity51),
  ...Object.values(entity52),
  ...Object.values(entity53),
  ...Object.values(entity54),
];
