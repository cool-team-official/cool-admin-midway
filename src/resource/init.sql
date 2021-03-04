/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 50725
 Source Host           : localhost:3306
 Source Schema         : cool

 Target Server Type    : MySQL
 Target Server Version : 50725
 File Encoding         : 65001

 Date: 04/03/2021 18:40:48
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for base_app_space_info
-- ----------------------------
DROP TABLE IF EXISTS `base_app_space_info`;
CREATE TABLE `base_app_space_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `url` varchar(255) NOT NULL COMMENT '地址',
  `type` varchar(255) NOT NULL COMMENT '类型',
  `classifyId` bigint(20) DEFAULT NULL COMMENT '分类ID',
  PRIMARY KEY (`id`),
  KEY `IDX_4aed04cbfa2ecdc01485b86e51` (`createTime`),
  KEY `IDX_abd5de4a4895eb253a5cabb20f` (`updateTime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for base_app_space_type
-- ----------------------------
DROP TABLE IF EXISTS `base_app_space_type`;
CREATE TABLE `base_app_space_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `name` varchar(255) NOT NULL COMMENT '类别名称',
  `parentId` tinyint(4) DEFAULT NULL COMMENT '父分类ID',
  PRIMARY KEY (`id`),
  KEY `IDX_5e8376603f89fdf3e7bb05103a` (`createTime`),
  KEY `IDX_500ea9e8b2c5c08c9b86a0667e` (`updateTime`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of base_app_space_type
-- ----------------------------
BEGIN;
INSERT INTO `base_app_space_type` VALUES (1, '2021-02-26 14:07:48.867045', '2021-02-26 14:07:48.867045', 'a', NULL);
INSERT INTO `base_app_space_type` VALUES (2, '2021-02-26 14:07:52.285531', '2021-02-26 14:07:52.285531', 'b', NULL);
COMMIT;

-- ----------------------------
-- Table structure for base_sys_conf
-- ----------------------------
DROP TABLE IF EXISTS `base_sys_conf`;
CREATE TABLE `base_sys_conf` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `cKey` varchar(255) NOT NULL COMMENT '配置键',
  `cValue` varchar(255) NOT NULL COMMENT '配置值',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_9be195d27767b4485417869c3a` (`cKey`),
  KEY `IDX_905208f206a3ff9fd513421971` (`createTime`),
  KEY `IDX_4c6f27f6ecefe51a5a196a047a` (`updateTime`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of base_sys_conf
-- ----------------------------
BEGIN;
INSERT INTO `base_sys_conf` VALUES (1, '2021-02-25 14:23:26.810981', '2021-02-25 14:23:26.810981', 'logKeep', '31');
COMMIT;

-- ----------------------------
-- Table structure for base_sys_department
-- ----------------------------
DROP TABLE IF EXISTS `base_sys_department`;
CREATE TABLE `base_sys_department` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `name` varchar(255) NOT NULL COMMENT '部门名称',
  `parentId` bigint(20) DEFAULT NULL COMMENT '上级部门ID',
  `orderNum` int(11) NOT NULL DEFAULT '0' COMMENT '排序',
  PRIMARY KEY (`id`),
  KEY `IDX_be4c53cd671384fa588ca9470a` (`createTime`),
  KEY `IDX_ca1473a793961ec55bc0c8d268` (`updateTime`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of base_sys_department
-- ----------------------------
BEGIN;
INSERT INTO `base_sys_department` VALUES (1, '2021-02-24 21:17:11.971397', '2021-02-24 21:17:15.697917', 'COOL', NULL, 0);
INSERT INTO `base_sys_department` VALUES (11, '2021-02-26 14:17:06.690613', '2021-02-26 14:17:06.690613', '开发', 1, 0);
INSERT INTO `base_sys_department` VALUES (12, '2021-02-26 14:17:11.576369', '2021-02-26 14:17:11.576369', '测试', 1, 0);
INSERT INTO `base_sys_department` VALUES (13, '2021-02-26 14:28:59.685177', '2021-02-26 14:28:59.685177', '游客', 1, 0);
COMMIT;

-- ----------------------------
-- Table structure for base_sys_log
-- ----------------------------
DROP TABLE IF EXISTS `base_sys_log`;
CREATE TABLE `base_sys_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `userId` bigint(20) DEFAULT NULL COMMENT '用户ID',
  `action` varchar(100) NOT NULL COMMENT '行为',
  `ip` varchar(50) DEFAULT NULL COMMENT 'ip',
  `ipAddr` varchar(50) DEFAULT NULL COMMENT 'ip地址',
  `params` text COMMENT '参数',
  PRIMARY KEY (`id`),
  KEY `IDX_51a2caeb5713efdfcb343a8772` (`userId`),
  KEY `IDX_938f886fb40e163db174b7f6c3` (`action`),
  KEY `IDX_24e18767659f8c7142580893f2` (`ip`),
  KEY `IDX_a03a27f75cf8d502b3060823e1` (`ipAddr`),
  KEY `IDX_c9382b76219a1011f7b8e7bcd1` (`createTime`),
  KEY `IDX_bfd44e885b470da43bcc39aaa7` (`updateTime`)
) ENGINE=InnoDB AUTO_INCREMENT=379 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of base_sys_log
-- ----------------------------
BEGIN;
INSERT INTO `base_sys_log` VALUES (1, '2021-03-03 11:01:54.222700', '2021-03-03 11:01:54.222700', 1, '/admin/base/sys/log/page', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"keyWord\":\"\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (2, '2021-03-03 11:01:56.898939', '2021-03-03 11:01:56.898939', 1, '/admin/base/sys/log/page', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"keyWord\":\"\",\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (3, '2021-03-03 11:02:40.875901', '2021-03-03 11:02:40.875901', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (4, '2021-03-03 11:02:44.010585', '2021-03-03 11:02:44.010585', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"eadb5680-7bcc-11eb-9eec-6fc1e29b365f\",\"verifyCode\":\"6326\"}');
INSERT INTO `base_sys_log` VALUES (5, '2021-03-03 11:02:44.296659', '2021-03-03 11:02:44.296659', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (6, '2021-03-03 11:02:44.547487', '2021-03-03 11:02:44.547487', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (7, '2021-03-03 11:02:56.389806', '2021-03-03 11:02:56.389806', 1, '/admin/base/sys/param/page', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20}');
INSERT INTO `base_sys_log` VALUES (8, '2021-03-03 11:02:57.235783', '2021-03-03 11:02:57.235783', 1, '/admin/base/sys/menu/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (9, '2021-03-03 11:03:01.954785', '2021-03-03 11:03:01.954785', 1, '/admin/base/sys/menu/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (10, '2021-03-03 11:03:01.978401', '2021-03-03 11:03:01.978401', 1, '/admin/base/sys/menu/info', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"id\":\"48\"}');
INSERT INTO `base_sys_log` VALUES (11, '2021-03-03 11:03:21.272469', '2021-03-03 11:03:21.272469', 1, '/admin/base/sys/menu/update', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"type\":1,\"name\":\"文档\",\"parentId\":\"47\",\"router\":\"/tutorial/doc\",\"keepAlive\":true,\"isShow\":true,\"viewPath\":\"https://admin.cool-js.com\",\"icon\":\"icon-log\",\"orderNum\":0,\"id\":48,\"createTime\":\"2019-11-08 09:35:53\",\"updateTime\":\"2021-03-03 10:00:03\",\"moduleName\":\"\"}');
INSERT INTO `base_sys_log` VALUES (12, '2021-03-03 11:03:21.656300', '2021-03-03 11:03:21.656300', 1, '/admin/base/sys/menu/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (13, '2021-03-03 11:03:27.097943', '2021-03-03 11:03:27.097943', 1, '/admin/base/sys/menu/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (14, '2021-03-03 11:03:29.011456', '2021-03-03 11:03:29.011456', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (15, '2021-03-03 11:03:29.028228', '2021-03-03 11:03:29.028228', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (16, '2021-03-03 11:03:29.050171', '2021-03-03 11:03:29.050171', 1, '/admin/base/comm/uploadMode', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (17, '2021-03-03 11:03:29.470765', '2021-03-03 11:03:29.470765', 1, '/admin/base/sys/menu/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (18, '2021-03-03 11:03:46.285901', '2021-03-03 11:03:46.285901', 1, '/admin/base/sys/department/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (19, '2021-03-03 11:03:46.300874', '2021-03-03 11:03:46.300874', 1, '/admin/base/sys/user/page', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (20, '2021-03-03 11:04:14.616829', '2021-03-03 11:04:14.616829', 1, '/admin/base/plugin/info/list', '127.0.0.1', '本机地址', NULL);
INSERT INTO `base_sys_log` VALUES (21, '2021-03-03 11:04:15.705906', '2021-03-03 11:04:15.705906', 1, '/admin/base/plugin/info/list', '127.0.0.1', '本机地址', NULL);
INSERT INTO `base_sys_log` VALUES (22, '2021-03-03 11:04:17.766276', '2021-03-03 11:04:17.766276', 1, '/admin/base/plugin/info/list', '127.0.0.1', '本机地址', '{\"title\":\"cool-mall商城\",\"pic\":\"https://docs.cool-js.com/mall/show05.jpeg\",\"price\":20}');
INSERT INTO `base_sys_log` VALUES (23, '2021-03-03 11:04:18.683676', '2021-03-03 11:04:18.683676', 1, '/admin/base/plugin/info/list', '127.0.0.1', '本机地址', '{\"title\":\"cool-mall商城\",\"pic\":\"https://docs.cool-js.com/mall/show05.jpeg\",\"price\":20}');
INSERT INTO `base_sys_log` VALUES (24, '2021-03-03 11:04:19.134959', '2021-03-03 11:04:19.134959', 1, '/admin/base/plugin/info/list', '127.0.0.1', '本机地址', '{\"title\":\"cool-mall商城\",\"pic\":\"https://docs.cool-js.com/mall/show05.jpeg\",\"price\":20}');
INSERT INTO `base_sys_log` VALUES (25, '2021-03-03 11:04:19.628677', '2021-03-03 11:04:19.628677', 1, '/admin/base/plugin/info/list', '127.0.0.1', '本机地址', '{\"title\":\"cool-mall商城\",\"pic\":\"https://docs.cool-js.com/mall/show05.jpeg\",\"price\":20}');
INSERT INTO `base_sys_log` VALUES (26, '2021-03-03 11:05:45.554221', '2021-03-03 11:05:45.554221', 1, '/admin/base/comm/permmenu', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (27, '2021-03-03 11:05:45.570439', '2021-03-03 11:05:45.570439', 1, '/admin/base/comm/uploadMode', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (28, '2021-03-03 11:05:45.571484', '2021-03-03 11:05:45.571484', 1, '/admin/base/comm/person', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (29, '2021-03-03 11:05:47.512021', '2021-03-03 11:05:47.512021', 1, '/admin/base/plugin/info/list', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (30, '2021-03-03 11:06:07.547015', '2021-03-03 11:06:07.547015', 1, '/admin/base/plugin/info/list', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (31, '2021-03-03 11:06:28.704106', '2021-03-03 11:06:28.704106', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (32, '2021-03-03 11:06:44.412150', '2021-03-03 11:06:44.412150', 1, '/admin/base/sys/department/list', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (33, '2021-03-03 11:06:44.691927', '2021-03-03 11:06:44.691927', 1, '/admin/base/sys/user/page', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (34, '2021-03-03 11:06:45.559848', '2021-03-03 11:06:45.559848', 1, '/admin/base/sys/menu/list', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (35, '2021-03-03 11:06:48.053824', '2021-03-03 11:06:48.053824', 1, '/admin/base/sys/role/page', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (36, '2021-03-03 11:06:50.688932', '2021-03-03 11:06:50.688932', 1, '/admin/base/comm/uploadMode', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (37, '2021-03-03 11:06:50.708908', '2021-03-03 11:06:50.708908', 1, '/admin/base/comm/person', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (38, '2021-03-03 11:06:50.713786', '2021-03-03 11:06:50.713786', 1, '/admin/base/comm/permmenu', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (39, '2021-03-03 11:06:51.135802', '2021-03-03 11:06:51.135802', 1, '/admin/base/sys/role/page', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (40, '2021-03-03 11:06:52.562647', '2021-03-03 11:06:52.562647', 1, '/admin/base/plugin/info/list', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (41, '2021-03-03 11:15:16.187289', '2021-03-03 11:15:16.187289', NULL, '/', '47.95.11.84', '中国北京', NULL);
INSERT INTO `base_sys_log` VALUES (42, '2021-03-03 11:15:16.345765', '2021-03-03 11:15:16.345765', NULL, '/', '47.95.11.84', '中国北京', NULL);
INSERT INTO `base_sys_log` VALUES (43, '2021-03-03 11:30:19.444090', '2021-03-03 11:30:19.444090', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (44, '2021-03-03 11:30:22.418326', '2021-03-03 11:30:22.418326', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"c7706ce0-7bd0-11eb-92b2-db7615aaaa87\",\"verifyCode\":\"3277\"}');
INSERT INTO `base_sys_log` VALUES (45, '2021-03-03 11:30:22.684255', '2021-03-03 11:30:22.684255', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (46, '2021-03-03 11:30:22.932985', '2021-03-03 11:30:22.932985', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (47, '2021-03-03 11:30:25.555890', '2021-03-03 11:30:25.555890', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (48, '2021-03-03 11:30:28.220291', '2021-03-03 11:30:28.220291', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (49, '2021-03-03 11:30:30.100952', '2021-03-03 11:30:30.100952', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (50, '2021-03-03 11:31:47.848700', '2021-03-03 11:31:47.848700', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (51, '2021-03-03 11:31:54.110808', '2021-03-03 11:31:54.110808', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"fc221c40-7bd0-11eb-b2bb-2342548c843b\",\"verifyCode\":\"5377\"}');
INSERT INTO `base_sys_log` VALUES (52, '2021-03-03 11:31:54.417350', '2021-03-03 11:31:54.417350', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (53, '2021-03-03 11:31:54.705066', '2021-03-03 11:31:54.705066', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (54, '2021-03-03 11:32:02.013432', '2021-03-03 11:32:02.013432', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (55, '2021-03-03 11:32:04.096748', '2021-03-03 11:32:04.096748', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (56, '2021-03-03 11:32:19.976058', '2021-03-03 11:32:19.976058', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (57, '2021-03-03 11:32:21.101309', '2021-03-03 11:32:21.101309', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (58, '2021-03-03 11:32:22.033932', '2021-03-03 11:32:22.033932', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (59, '2021-03-03 11:32:47.303710', '2021-03-03 11:32:47.303710', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (60, '2021-03-03 11:32:56.580349', '2021-03-03 11:32:56.580349', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (61, '2021-03-03 11:33:06.575952', '2021-03-03 11:33:06.575952', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (62, '2021-03-03 11:33:10.830279', '2021-03-03 11:33:10.830279', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (63, '2021-03-03 11:33:22.229699', '2021-03-03 11:33:22.229699', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (64, '2021-03-03 11:33:23.403796', '2021-03-03 11:33:23.403796', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (65, '2021-03-03 11:33:32.407775', '2021-03-03 11:33:32.407775', NULL, '/boaform/admin/formLogin', '47.95.11.84', '中国北京', '{\"username\":\"admin\",\"psd\":\"Feefifofum\"}');
INSERT INTO `base_sys_log` VALUES (66, '2021-03-03 11:35:54.537609', '2021-03-03 11:35:54.537609', NULL, '/admin/base/open/captcha', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (67, '2021-03-03 11:37:12.348080', '2021-03-03 11:37:12.348080', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (68, '2021-03-03 11:37:15.298912', '2021-03-03 11:37:15.298912', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"bd8cba70-7bd1-11eb-bb57-df42a45b522d\",\"verifyCode\":\"3047\"}');
INSERT INTO `base_sys_log` VALUES (69, '2021-03-03 11:37:15.615344', '2021-03-03 11:37:15.615344', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (70, '2021-03-03 11:37:15.952380', '2021-03-03 11:37:15.952380', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (71, '2021-03-03 11:37:18.939883', '2021-03-03 11:37:18.939883', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (72, '2021-03-03 11:37:20.314878', '2021-03-03 11:37:20.314878', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (73, '2021-03-03 11:37:38.934250', '2021-03-03 11:37:38.934250', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (74, '2021-03-03 11:37:58.180313', '2021-03-03 11:37:58.180313', NULL, '/admin/base/open/captcha', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (75, '2021-03-03 11:38:02.697943', '2021-03-03 11:38:02.697943', NULL, '/admin/base/open/login', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"d8de4a00-7bd1-11eb-bb57-df42a45b522d\",\"verifyCode\":\"6074\"}');
INSERT INTO `base_sys_log` VALUES (76, '2021-03-03 11:38:02.975814', '2021-03-03 11:38:02.975814', 1, '/admin/base/comm/person', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (77, '2021-03-03 11:38:03.274356', '2021-03-03 11:38:03.274356', 1, '/admin/base/comm/permmenu', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (78, '2021-03-03 11:38:06.075150', '2021-03-03 11:38:06.075150', 1, '/admin/base/plugin/info/list', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (79, '2021-03-03 11:38:16.613655', '2021-03-03 11:38:16.613655', 1, '/admin/base/plugin/info/list', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (80, '2021-03-03 11:39:00.614923', '2021-03-03 11:39:00.614923', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (81, '2021-03-03 11:39:00.736069', '2021-03-03 11:39:00.736069', NULL, '/admin/base/open/captcha', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (82, '2021-03-03 11:39:08.454311', '2021-03-03 11:39:08.454311', NULL, '/admin/base/open/login', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"fe26a960-7bd1-11eb-9e02-41121c9cfb7c\",\"verifyCode\":\"1736\"}');
INSERT INTO `base_sys_log` VALUES (83, '2021-03-03 11:39:08.688300', '2021-03-03 11:39:08.688300', 1, '/admin/base/comm/person', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (84, '2021-03-03 11:39:08.883525', '2021-03-03 11:39:08.883525', 1, '/admin/base/comm/permmenu', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (85, '2021-03-03 11:39:10.260145', '2021-03-03 11:39:10.260145', NULL, '/login', '47.95.11.84', '中国北京', NULL);
INSERT INTO `base_sys_log` VALUES (86, '2021-03-03 11:39:11.317263', '2021-03-03 11:39:11.317263', 1, '/admin/base/plugin/info/list', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (87, '2021-03-03 11:39:21.391086', '2021-03-03 11:39:21.391086', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"fe1432d0-7bd1-11eb-9e02-41121c9cfb7c\",\"verifyCode\":\"3634\"}');
INSERT INTO `base_sys_log` VALUES (88, '2021-03-03 11:39:21.674836', '2021-03-03 11:39:21.674836', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (89, '2021-03-03 11:39:21.952301', '2021-03-03 11:39:21.952301', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (90, '2021-03-03 11:39:28.095199', '2021-03-03 11:39:28.095199', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (91, '2021-03-03 11:39:34.789189', '2021-03-03 11:39:34.789189', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (92, '2021-03-03 11:41:55.815599', '2021-03-03 11:41:55.815599', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (93, '2021-03-03 11:42:00.780565', '2021-03-03 11:42:00.780565', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"66825c20-7bd2-11eb-b7aa-412782768324\",\"verifyCode\":\"7886\"}');
INSERT INTO `base_sys_log` VALUES (94, '2021-03-03 11:42:01.145319', '2021-03-03 11:42:01.145319', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (95, '2021-03-03 11:42:01.400070', '2021-03-03 11:42:01.400070', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (96, '2021-03-03 11:42:07.369861', '2021-03-03 11:42:07.369861', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (97, '2021-03-03 11:42:08.945867', '2021-03-03 11:42:08.945867', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (98, '2021-03-03 11:42:20.875388', '2021-03-03 11:42:20.875388', 1, '/admin/base/plugin/info/config', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\",\"config\":{\"host\":\"127.0.0.1\",\"port\":\"6379\",\"db\":\"2\"}}');
INSERT INTO `base_sys_log` VALUES (99, '2021-03-03 11:42:22.870484', '2021-03-03 11:42:22.870484', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (100, '2021-03-03 11:42:32.292481', '2021-03-03 11:42:32.292481', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (101, '2021-03-03 11:42:33.250487', '2021-03-03 11:42:33.250487', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (102, '2021-03-03 11:42:34.018262', '2021-03-03 11:42:34.018262', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (103, '2021-03-03 11:42:34.746348', '2021-03-03 11:42:34.746348', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (104, '2021-03-03 11:42:36.921924', '2021-03-03 11:42:36.921924', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (105, '2021-03-03 11:47:33.659450', '2021-03-03 11:47:33.659450', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (106, '2021-03-03 11:47:45.172766', '2021-03-03 11:47:45.172766', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"2fe0f540-7bd3-11eb-8187-376dd2397d55\",\"verifyCode\":\"0562\"}');
INSERT INTO `base_sys_log` VALUES (107, '2021-03-03 11:47:45.472994', '2021-03-03 11:47:45.472994', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (108, '2021-03-03 11:47:45.724668', '2021-03-03 11:47:45.724668', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (109, '2021-03-03 11:47:57.586997', '2021-03-03 11:47:57.586997', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (110, '2021-03-03 11:47:59.127194', '2021-03-03 11:47:59.127194', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (111, '2021-03-03 11:48:50.975533', '2021-03-03 11:48:50.975533', 1, '/admin/base/comm/permmenu', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (112, '2021-03-03 11:48:51.004121', '2021-03-03 11:48:51.004121', 1, '/admin/base/comm/uploadMode', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (113, '2021-03-03 11:48:51.012095', '2021-03-03 11:48:51.012095', 1, '/admin/base/comm/person', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (114, '2021-03-03 11:48:51.427097', '2021-03-03 11:48:51.427097', 1, '/admin/base/plugin/info/list', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (115, '2021-03-03 11:58:29.622254', '2021-03-03 11:58:29.622254', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (116, '2021-03-03 11:58:34.369532', '2021-03-03 11:58:34.369532', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"b6dcf7f0-7bd4-11eb-86a0-d32d1be593bd\",\"verifyCode\":\"8584\"}');
INSERT INTO `base_sys_log` VALUES (117, '2021-03-03 11:58:34.667743', '2021-03-03 11:58:34.667743', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (118, '2021-03-03 11:58:34.917021', '2021-03-03 11:58:34.917021', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (119, '2021-03-03 11:58:41.020338', '2021-03-03 11:58:41.020338', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (120, '2021-03-03 11:58:42.430400', '2021-03-03 11:58:42.430400', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (121, '2021-03-03 12:04:20.571276', '2021-03-03 12:04:20.571276', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (122, '2021-03-03 12:04:22.212959', '2021-03-03 12:04:22.212959', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (123, '2021-03-03 12:04:37.029554', '2021-03-03 12:04:37.029554', 1, '/admin/base/plugin/info/config', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\",\"config\":{\"host\":\"127.0.0.1\",\"port\":\"6379\",\"db\":\"2\"}}');
INSERT INTO `base_sys_log` VALUES (124, '2021-03-03 12:04:48.551840', '2021-03-03 12:04:48.551840', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (125, '2021-03-03 12:05:04.372712', '2021-03-03 12:05:04.372712', 1, '/admin/base/plugin/info/config', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\",\"config\":{\"host\":\"127.0.0.1\",\"port\":\"6379\",\"db\":\"2\"}}');
INSERT INTO `base_sys_log` VALUES (126, '2021-03-03 12:06:11.450124', '2021-03-03 12:06:11.450124', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (127, '2021-03-03 12:06:24.696765', '2021-03-03 12:06:24.696765', 1, '/admin/base/plugin/info/config', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\",\"config\":{\"host\":\"127.0.0.1\",\"port\":\"6379\",\"db\":\"2\"}}');
INSERT INTO `base_sys_log` VALUES (128, '2021-03-03 12:37:31.198824', '2021-03-03 12:37:31.198824', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (129, '2021-03-03 12:37:38.861065', '2021-03-03 12:37:38.861065', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"2a8d4380-7bda-11eb-a76f-79e6abdcdd4a\",\"verifyCode\":\"9856\"}');
INSERT INTO `base_sys_log` VALUES (130, '2021-03-03 12:37:39.235926', '2021-03-03 12:37:39.235926', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (131, '2021-03-03 12:37:39.527807', '2021-03-03 12:37:39.527807', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (132, '2021-03-03 12:37:47.654810', '2021-03-03 12:37:47.654810', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (133, '2021-03-03 12:37:49.672549', '2021-03-03 12:37:49.672549', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (134, '2021-03-03 12:37:59.866591', '2021-03-03 12:37:59.866591', 1, '/admin/base/plugin/info/config', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\",\"config\":{\"host\":\"127.0.0.1\",\"port\":\"6379\",\"db\":\"2\"}}');
INSERT INTO `base_sys_log` VALUES (135, '2021-03-03 12:38:20.054237', '2021-03-03 12:38:20.054237', 1, '/admin/base/plugin/info/config', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\",\"config\":{\"host\":\"127.0.0.1\",\"port\":\"6379\",\"db\":\"2\"}}');
INSERT INTO `base_sys_log` VALUES (136, '2021-03-03 12:38:56.833324', '2021-03-03 12:38:56.833324', 1, '/admin/base/plugin/info/config', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\",\"config\":{\"host\":\"127.0.0.1\",\"port\":\"6379\",\"db\":\"2\"}}');
INSERT INTO `base_sys_log` VALUES (137, '2021-03-03 12:39:27.831048', '2021-03-03 12:39:27.831048', 1, '/admin/base/plugin/info/config', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\",\"config\":{\"host\":\"127.0.0.1\",\"port\":\"6379\",\"db\":\"2\"}}');
INSERT INTO `base_sys_log` VALUES (138, '2021-03-03 12:40:07.033082', '2021-03-03 12:40:07.033082', 1, '/admin/base/plugin/info/config', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\",\"config\":{\"host\":\"127.0.0.1\",\"port\":\"6379\",\"db\":\"2\"}}');
INSERT INTO `base_sys_log` VALUES (139, '2021-03-03 12:41:15.821481', '2021-03-03 12:41:15.821481', 1, '/admin/base/plugin/info/config', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\",\"config\":{\"host\":\"127.0.0.1\",\"port\":\"6379\",\"db\":\"2\"}}');
INSERT INTO `base_sys_log` VALUES (140, '2021-03-03 12:41:33.562859', '2021-03-03 12:41:33.562859', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (141, '2021-03-03 12:41:45.720085', '2021-03-03 12:41:45.720085', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (142, '2021-03-03 12:43:00.529503', '2021-03-03 12:43:00.529503', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (143, '2021-03-03 12:43:21.070988', '2021-03-03 12:43:21.070988', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (144, '2021-03-03 12:43:22.084730', '2021-03-03 12:43:22.084730', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (145, '2021-03-03 12:43:22.920935', '2021-03-03 12:43:22.920935', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (146, '2021-03-03 12:43:44.176126', '2021-03-03 12:43:44.176126', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (147, '2021-03-03 12:43:45.221684', '2021-03-03 12:43:45.221684', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (148, '2021-03-03 12:44:07.927725', '2021-03-03 12:44:07.927725', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (149, '2021-03-03 12:44:08.858782', '2021-03-03 12:44:08.858782', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (150, '2021-03-03 12:47:16.342583', '2021-03-03 12:47:16.342583', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (151, '2021-03-03 12:47:19.227135', '2021-03-03 12:47:19.227135', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (152, '2021-03-03 12:47:21.756207', '2021-03-03 12:47:21.756207', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (153, '2021-03-03 12:47:21.869090', '2021-03-03 12:47:21.869090', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (154, '2021-03-03 12:48:10.311379', '2021-03-03 12:48:10.311379', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (155, '2021-03-03 12:51:49.992017', '2021-03-03 12:51:49.992017', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (156, '2021-03-03 12:54:07.485374', '2021-03-03 12:54:07.485374', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (157, '2021-03-03 12:54:11.304156', '2021-03-03 12:54:11.304156', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"7c629870-7bdc-11eb-979a-233990c34665\",\"verifyCode\":\"3162\"}');
INSERT INTO `base_sys_log` VALUES (158, '2021-03-03 12:54:11.671938', '2021-03-03 12:54:11.671938', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (159, '2021-03-03 12:54:11.941651', '2021-03-03 12:54:11.941651', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (160, '2021-03-03 13:01:47.877004', '2021-03-03 13:01:47.877004', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (161, '2021-03-03 13:01:51.535379', '2021-03-03 13:01:51.535379', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"8eccafe0-7bdd-11eb-8ecb-43e1335af481\",\"verifyCode\":\"4597\"}');
INSERT INTO `base_sys_log` VALUES (162, '2021-03-03 13:01:51.848700', '2021-03-03 13:01:51.848700', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (163, '2021-03-03 13:01:52.122302', '2021-03-03 13:01:52.122302', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (164, '2021-03-03 13:02:19.199818', '2021-03-03 13:02:19.199818', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (165, '2021-03-03 13:02:24.358942', '2021-03-03 13:02:24.358942', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"a17880b0-7bdd-11eb-8ecb-43e1335af481\",\"verifyCode\":\"4271\"}');
INSERT INTO `base_sys_log` VALUES (166, '2021-03-03 13:02:24.687777', '2021-03-03 13:02:24.687777', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (167, '2021-03-03 13:02:24.994263', '2021-03-03 13:02:24.994263', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (168, '2021-03-03 13:02:48.525879', '2021-03-03 13:02:48.525879', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (169, '2021-03-03 13:03:01.846832', '2021-03-03 13:03:01.846832', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"b2f372a0-7bdd-11eb-8ecb-43e1335af481\",\"verifyCode\":\"4384\"}');
INSERT INTO `base_sys_log` VALUES (170, '2021-03-03 13:03:02.189527', '2021-03-03 13:03:02.189527', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (171, '2021-03-03 13:03:02.538320', '2021-03-03 13:03:02.538320', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (172, '2021-03-03 13:03:35.610808', '2021-03-03 13:03:35.610808', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (173, '2021-03-03 13:03:46.164586', '2021-03-03 13:03:46.164586', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"cf043380-7bdd-11eb-8ecb-43e1335af481\",\"verifyCode\":\"8135\"}');
INSERT INTO `base_sys_log` VALUES (174, '2021-03-03 13:03:46.590367', '2021-03-03 13:03:46.590367', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (175, '2021-03-03 13:03:46.935747', '2021-03-03 13:03:46.935747', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (176, '2021-03-03 13:46:07.088906', '2021-03-03 13:46:07.088906', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (177, '2021-03-03 13:46:18.224914', '2021-03-03 13:46:18.224914', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"bfd08ac0-7be3-11eb-8eba-296fb5f7e688\",\"verifyCode\":\"3286\"}');
INSERT INTO `base_sys_log` VALUES (178, '2021-03-03 13:46:18.520641', '2021-03-03 13:46:18.520641', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (179, '2021-03-03 13:46:18.846884', '2021-03-03 13:46:18.846884', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (180, '2021-03-03 13:47:57.814435', '2021-03-03 13:47:57.814435', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (181, '2021-03-03 13:48:07.439695', '2021-03-03 13:48:07.439695', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"01ce7680-7be4-11eb-8eba-296fb5f7e688\",\"verifyCode\":\"3516\"}');
INSERT INTO `base_sys_log` VALUES (182, '2021-03-03 13:48:09.068841', '2021-03-03 13:48:09.068841', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (183, '2021-03-03 13:48:09.884418', '2021-03-03 13:48:09.884418', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (184, '2021-03-03 13:48:38.057723', '2021-03-03 13:48:38.057723', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (185, '2021-03-03 13:48:51.418051', '2021-03-03 13:48:51.418051', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"19ccbc60-7be4-11eb-8eba-296fb5f7e688\",\"verifyCode\":\"7312\"}');
INSERT INTO `base_sys_log` VALUES (186, '2021-03-03 13:48:53.069038', '2021-03-03 13:48:53.069038', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (187, '2021-03-03 13:48:54.215294', '2021-03-03 13:48:54.215294', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (188, '2021-03-03 13:49:20.944801', '2021-03-03 13:49:20.944801', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (189, '2021-03-03 13:49:53.967375', '2021-03-03 13:49:53.967375', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"335cece0-7be4-11eb-8eba-296fb5f7e688\",\"verifyCode\":\"2866\"}');
INSERT INTO `base_sys_log` VALUES (190, '2021-03-03 13:49:54.291343', '2021-03-03 13:49:54.291343', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (191, '2021-03-03 13:49:54.558646', '2021-03-03 13:49:54.558646', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (192, '2021-03-03 13:50:18.735987', '2021-03-03 13:50:18.735987', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (193, '2021-03-03 13:50:22.500920', '2021-03-03 13:50:22.500920', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"55ced3b0-7be4-11eb-8eba-296fb5f7e688\",\"verifyCode\":\"1828\"}');
INSERT INTO `base_sys_log` VALUES (194, '2021-03-03 13:50:22.806705', '2021-03-03 13:50:22.806705', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (195, '2021-03-03 13:50:23.050103', '2021-03-03 13:50:23.050103', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (196, '2021-03-03 13:51:23.961285', '2021-03-03 13:51:23.961285', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (197, '2021-03-03 13:51:59.630060', '2021-03-03 13:51:59.630060', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"7caf5f40-7be4-11eb-b619-479bbbd00e34\",\"verifyCode\":\"0497\"}');
INSERT INTO `base_sys_log` VALUES (198, '2021-03-03 13:51:59.941572', '2021-03-03 13:51:59.941572', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (199, '2021-03-03 13:52:00.203939', '2021-03-03 13:52:00.203939', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (200, '2021-03-03 13:52:32.266845', '2021-03-03 13:52:32.266845', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (201, '2021-03-03 13:53:28.989190', '2021-03-03 13:53:28.989190', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"a5665880-7be4-11eb-b619-479bbbd00e34\",\"verifyCode\":\"7220\"}');
INSERT INTO `base_sys_log` VALUES (202, '2021-03-03 13:53:29.313387', '2021-03-03 13:53:29.313387', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (203, '2021-03-03 13:53:32.913177', '2021-03-03 13:53:32.913177', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"c766dfe0-7be4-11eb-b619-479bbbd00e34\",\"verifyCode\":\"3887\"}');
INSERT INTO `base_sys_log` VALUES (204, '2021-03-03 13:53:33.208015', '2021-03-03 13:53:33.208015', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (205, '2021-03-03 13:53:33.474156', '2021-03-03 13:53:33.474156', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (206, '2021-03-03 13:54:03.695568', '2021-03-03 13:54:03.695568', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (207, '2021-03-03 16:32:52.521369', '2021-03-03 16:32:52.521369', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (208, '2021-03-03 16:32:55.554472', '2021-03-03 16:32:55.554472', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"0b84c370-7bfb-11eb-8872-09e1840c83f5\",\"verifyCode\":\"6250\"}');
INSERT INTO `base_sys_log` VALUES (209, '2021-03-03 16:32:55.857952', '2021-03-03 16:32:55.857952', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (210, '2021-03-03 16:32:56.142812', '2021-03-03 16:32:56.142812', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (211, '2021-03-03 16:33:21.732921', '2021-03-03 16:33:21.732921', NULL, '/admin/base/open/captcha', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (212, '2021-03-03 16:48:53.060307', '2021-03-03 16:48:53.060307', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (213, '2021-03-03 16:48:58.736081', '2021-03-03 16:48:58.736081', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"480b1400-7bfd-11eb-8e22-e1f0ce2028ec\",\"verifyCode\":\"6072\"}');
INSERT INTO `base_sys_log` VALUES (214, '2021-03-03 16:48:59.053596', '2021-03-03 16:48:59.053596', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (215, '2021-03-03 16:48:59.322111', '2021-03-03 16:48:59.322111', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (216, '2021-03-03 16:49:03.571630', '2021-03-03 16:49:03.571630', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (217, '2021-03-03 16:49:14.033261', '2021-03-03 16:49:14.033261', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"4e4eedf0-7bfd-11eb-8e22-e1f0ce2028ec\",\"verifyCode\":\"6688\"}');
INSERT INTO `base_sys_log` VALUES (218, '2021-03-03 16:49:14.337858', '2021-03-03 16:49:14.337858', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (219, '2021-03-03 16:49:14.604046', '2021-03-03 16:49:14.604046', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (220, '2021-03-03 16:49:38.447620', '2021-03-03 16:49:38.447620', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (221, '2021-03-03 16:56:23.715159', '2021-03-03 16:56:23.715159', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"63186ea0-7bfd-11eb-8e22-e1f0ce2028ec\",\"verifyCode\":\"8878\"}');
INSERT INTO `base_sys_log` VALUES (222, '2021-03-03 16:56:23.998791', '2021-03-03 16:56:23.998791', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (223, '2021-03-03 16:56:24.271864', '2021-03-03 16:56:24.271864', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (224, '2021-03-03 16:56:26.677296', '2021-03-03 16:56:26.677296', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (225, '2021-03-03 16:56:27.853918', '2021-03-03 16:56:27.853918', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (226, '2021-03-03 16:56:28.564355', '2021-03-03 16:56:28.564355', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (227, '2021-03-03 16:56:29.531484', '2021-03-03 16:56:29.531484', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (228, '2021-03-03 16:58:35.343023', '2021-03-03 16:58:35.343023', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (229, '2021-03-03 16:58:36.436697', '2021-03-03 16:58:36.436697', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (230, '2021-03-03 16:58:38.446528', '2021-03-03 16:58:38.446528', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (231, '2021-03-03 16:58:40.823075', '2021-03-03 16:58:40.823075', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (232, '2021-03-03 16:58:41.458627', '2021-03-03 16:58:41.458627', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (233, '2021-03-03 17:04:11.431666', '2021-03-03 17:04:11.431666', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (234, '2021-03-03 17:04:12.437287', '2021-03-03 17:04:12.437287', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (235, '2021-03-03 17:04:44.304084', '2021-03-03 17:04:44.304084', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (236, '2021-03-03 17:04:46.242201', '2021-03-03 17:04:46.242201', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (237, '2021-03-03 17:06:22.669104', '2021-03-03 17:06:22.669104', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (238, '2021-03-03 17:06:24.524643', '2021-03-03 17:06:24.524643', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (239, '2021-03-03 17:09:08.448245', '2021-03-03 17:09:08.448245', 1, '/admin/base/sys/param/page', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20}');
INSERT INTO `base_sys_log` VALUES (240, '2021-03-03 17:09:09.258562', '2021-03-03 17:09:09.258562', 1, '/admin/space/type/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (241, '2021-03-03 17:09:09.529127', '2021-03-03 17:09:09.529127', 1, '/admin/space/info/page', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":12,\"total\":0,\"classifyId\":null}');
INSERT INTO `base_sys_log` VALUES (242, '2021-03-03 17:09:47.152943', '2021-03-03 17:09:47.152943', NULL, '/admin/base/open/login', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"1ced8cf0-7bfb-11eb-8872-09e1840c83f5\",\"verifyCode\":\"6438\"}');
INSERT INTO `base_sys_log` VALUES (243, '2021-03-03 17:09:47.427300', '2021-03-03 17:09:47.427300', NULL, '/admin/base/open/captcha', '127.0.0.1, 117.30.114.56', '本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (244, '2021-03-03 17:10:06.718584', '2021-03-03 17:10:06.718584', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (245, '2021-03-03 17:10:08.392878', '2021-03-03 17:10:08.392878', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (246, '2021-03-03 17:12:38.771099', '2021-03-03 17:12:38.771099', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (247, '2021-03-03 17:12:41.510661', '2021-03-03 17:12:41.510661', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (248, '2021-03-03 17:12:43.314389', '2021-03-03 17:12:43.314389', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (249, '2021-03-03 17:13:03.242506', '2021-03-03 17:13:03.242506', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (250, '2021-03-03 17:13:09.862915', '2021-03-03 17:13:09.862915', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (251, '2021-03-03 17:13:13.522996', '2021-03-03 17:13:13.522996', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (252, '2021-03-03 17:22:08.108223', '2021-03-03 17:22:08.108223', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (253, '2021-03-03 17:22:13.484492', '2021-03-03 17:22:13.484492', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"ed2f6590-7c01-11eb-82c8-c5878b78cfda\",\"verifyCode\":\"3233\"}');
INSERT INTO `base_sys_log` VALUES (254, '2021-03-03 17:22:13.757471', '2021-03-03 17:22:13.757471', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (255, '2021-03-03 17:22:14.011915', '2021-03-03 17:22:14.011915', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (256, '2021-03-03 17:22:21.779030', '2021-03-03 17:22:21.779030', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (257, '2021-03-03 17:22:25.192213', '2021-03-03 17:22:25.192213', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (258, '2021-03-03 17:22:48.679544', '2021-03-03 17:22:48.679544', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (259, '2021-03-03 17:22:50.750458', '2021-03-03 17:22:50.750458', 1, '/admin/base/plugin/info/config', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\",\"config\":{\"redis\":\"{\\n    \\\"host\\\": \\\"127.0.0.1\\\",\\n    \\\"password\\\": \\\"\\\",\\n    \\\"port\\\": 6379,\\n    \\\"db\\\": 2\\n}\"}}');
INSERT INTO `base_sys_log` VALUES (260, '2021-03-03 17:23:13.972800', '2021-03-03 17:23:13.972800', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (261, '2021-03-03 17:23:15.076655', '2021-03-03 17:23:15.076655', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (262, '2021-03-03 17:23:39.536115', '2021-03-03 17:23:39.536115', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (263, '2021-03-03 17:23:51.472687', '2021-03-03 17:23:51.472687', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (264, '2021-03-03 17:23:54.293333', '2021-03-03 17:23:54.293333', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"2acb56c0-7c02-11eb-98b7-792421c267c8\",\"verifyCode\":\"2399\"}');
INSERT INTO `base_sys_log` VALUES (265, '2021-03-03 17:23:54.569564', '2021-03-03 17:23:54.569564', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (266, '2021-03-03 17:23:54.831497', '2021-03-03 17:23:54.831497', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (267, '2021-03-03 17:23:59.135326', '2021-03-03 17:23:59.135326', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (268, '2021-03-03 17:24:00.094109', '2021-03-03 17:24:00.094109', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (269, '2021-03-03 17:24:12.141484', '2021-03-03 17:24:12.141484', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (270, '2021-03-03 17:30:48.462329', '2021-03-03 17:30:48.462329', 1, '/admin/base/plugin/info/config', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\",\"config\":{\"redis\":\"{\\n    \\\"host\\\": \\\"127.0.0.1\\\",\\n    \\\"password\\\": \\\"\\\",\\n    \\\"port\\\": 6379,\\n    \\\"db\\\": 2\\n}\"}}');
INSERT INTO `base_sys_log` VALUES (271, '2021-03-03 17:31:12.708111', '2021-03-03 17:31:12.708111', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"keyWord\":\"reds\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (272, '2021-03-03 17:31:14.924360', '2021-03-03 17:31:14.924360', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"keyWord\":\"red\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (273, '2021-03-03 17:31:17.324613', '2021-03-03 17:31:17.324613', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"keyWord\":\"\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (274, '2021-03-03 17:31:20.737629', '2021-03-03 17:31:20.737629', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"keyWord\":\"Redi\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (275, '2021-03-03 17:31:21.858243', '2021-03-03 17:31:21.858243', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"keyWord\":\"\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (276, '2021-03-03 17:31:27.643338', '2021-03-03 17:31:27.643338', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"keyWord\":\"\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (277, '2021-03-03 17:31:28.377406', '2021-03-03 17:31:28.377406', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"keyWord\":\"\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (278, '2021-03-03 17:31:28.883226', '2021-03-03 17:31:28.883226', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"keyWord\":\"\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (279, '2021-03-03 17:31:29.310141', '2021-03-03 17:31:29.310141', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"keyWord\":\"\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (280, '2021-03-03 17:31:29.585430', '2021-03-03 17:31:29.585430', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"keyWord\":\"\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (281, '2021-03-03 17:31:29.985625', '2021-03-03 17:31:29.985625', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"keyWord\":\"\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (282, '2021-03-03 17:31:30.324320', '2021-03-03 17:31:30.324320', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"keyWord\":\"\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (283, '2021-03-03 17:31:47.080049', '2021-03-03 17:31:47.080049', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"keyWord\":\"\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (284, '2021-03-03 17:31:47.835452', '2021-03-03 17:31:47.835452', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"keyWord\":\"\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (285, '2021-03-03 17:31:48.437822', '2021-03-03 17:31:48.437822', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"keyWord\":\"\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (286, '2021-03-03 17:31:49.016782', '2021-03-03 17:31:49.016782', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"keyWord\":\"\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (287, '2021-03-03 17:31:49.588644', '2021-03-03 17:31:49.588644', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"keyWord\":\"\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (288, '2021-03-03 17:31:50.071995', '2021-03-03 17:31:50.071995', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"keyWord\":\"\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (289, '2021-03-03 17:31:50.635501', '2021-03-03 17:31:50.635501', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"keyWord\":\"\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (290, '2021-03-03 17:31:51.049890', '2021-03-03 17:31:51.049890', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"keyWord\":\"\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (291, '2021-03-03 17:31:51.898896', '2021-03-03 17:31:51.898896', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"keyWord\":\"\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (292, '2021-03-03 17:31:52.386029', '2021-03-03 17:31:52.386029', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"keyWord\":\"\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (293, '2021-03-03 17:31:53.388626', '2021-03-03 17:31:53.388626', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (294, '2021-03-03 17:31:56.685032', '2021-03-03 17:31:56.685032', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (295, '2021-03-03 17:31:58.994081', '2021-03-03 17:31:58.994081', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (296, '2021-03-03 17:32:02.135990', '2021-03-03 17:32:02.135990', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (297, '2021-03-03 17:32:04.360170', '2021-03-03 17:32:04.360170', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"keyWord\":\"\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (298, '2021-03-03 17:32:30.308714', '2021-03-03 17:32:30.308714', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (299, '2021-03-03 17:38:04.680237', '2021-03-03 17:38:04.680237', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"keyWord\":\"\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (300, '2021-03-03 17:38:05.835226', '2021-03-03 17:38:05.835226', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"keyWord\":\"\",\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (301, '2021-03-03 17:38:06.726026', '2021-03-03 17:38:06.726026', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (302, '2021-03-03 17:38:12.920429', '2021-03-03 17:38:12.920429', 1, '/admin/base/plugin/info/config', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\",\"config\":{\"redis\":\"[{\\n    \\\"host\\\": \\\"127.0.0.1\\\",\\n    \\\"password\\\": \\\"\\\",\\n    \\\"port\\\": 6379,\\n    \\\"db\\\": 2\\n}]\"}}');
INSERT INTO `base_sys_log` VALUES (303, '2021-03-03 17:38:46.740764', '2021-03-03 17:38:46.740764', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (304, '2021-03-03 17:38:52.715618', '2021-03-03 17:38:52.715618', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"406ab320-7c04-11eb-be2d-811a65c83598\",\"verifyCode\":\"6183\"}');
INSERT INTO `base_sys_log` VALUES (305, '2021-03-03 17:38:53.072073', '2021-03-03 17:38:53.072073', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (306, '2021-03-03 17:38:53.372572', '2021-03-03 17:38:53.372572', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (307, '2021-03-03 17:38:56.500039', '2021-03-03 17:38:56.500039', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (308, '2021-03-03 17:38:57.927997', '2021-03-03 17:38:57.927997', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (309, '2021-03-03 17:39:02.997722', '2021-03-03 17:39:02.997722', 1, '/admin/base/plugin/info/config', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\",\"config\":{\"redis\":\"{\\n    \\\"host\\\": \\\"127.0.0.1\\\",\\n    \\\"password\\\": \\\"\\\",\\n    \\\"port\\\": 6379,\\n    \\\"db\\\": 2\\n}\"}}');
INSERT INTO `base_sys_log` VALUES (310, '2021-03-03 17:39:15.317374', '2021-03-03 17:39:15.317374', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (311, '2021-03-03 17:39:16.339704', '2021-03-03 17:39:16.339704', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (312, '2021-03-03 17:39:17.490028', '2021-03-03 17:39:17.490028', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (313, '2021-03-03 17:45:05.721620', '2021-03-03 17:45:05.721620', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (314, '2021-03-03 17:48:37.705498', '2021-03-03 17:48:37.705498', 1, '/admin/base/plugin/info/enable', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\",\"enable\":0}');
INSERT INTO `base_sys_log` VALUES (315, '2021-03-03 17:48:48.106098', '2021-03-03 17:48:48.106098', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (316, '2021-03-03 17:48:50.939509', '2021-03-03 17:48:50.939509', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (317, '2021-03-03 17:48:51.024888', '2021-03-03 17:48:51.024888', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (318, '2021-03-03 17:49:21.259342', '2021-03-03 17:49:21.259342', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (319, '2021-03-03 17:49:22.306161', '2021-03-03 17:49:22.306161', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (320, '2021-03-03 17:49:23.790581', '2021-03-03 17:49:23.790581', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (321, '2021-03-03 17:49:31.851339', '2021-03-03 17:49:31.851339', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (322, '2021-03-03 17:49:33.912464', '2021-03-03 17:49:33.912464', 1, '/admin/base/sys/param/page', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20}');
INSERT INTO `base_sys_log` VALUES (323, '2021-03-03 17:49:35.748862', '2021-03-03 17:49:35.748862', 1, '/admin/base/sys/param/page', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true}');
INSERT INTO `base_sys_log` VALUES (324, '2021-03-03 17:49:38.321481', '2021-03-03 17:49:38.321481', 1, '/admin/base/sys/param/info', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"id\":\"2\"}');
INSERT INTO `base_sys_log` VALUES (325, '2021-03-03 17:49:51.142980', '2021-03-03 17:49:51.142980', 1, '/admin/base/sys/param/update', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"name\":\"JSON参数\",\"keyName\":\"json\",\"data\":\"{\\n    code: 111\\n}\",\"remark\":null,\"id\":2,\"createTime\":\"2021-02-26 13:53:18\",\"updateTime\":\"2021-02-26 13:53:18\",\"dataType\":0}');
INSERT INTO `base_sys_log` VALUES (326, '2021-03-03 17:49:51.883958', '2021-03-03 17:49:51.883958', 1, '/admin/base/sys/param/page', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true}');
INSERT INTO `base_sys_log` VALUES (327, '2021-03-03 17:49:54.834253', '2021-03-03 17:49:54.834253', 1, '/admin/base/sys/param/info', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"id\":\"1\"}');
INSERT INTO `base_sys_log` VALUES (328, '2021-03-03 17:49:55.590512', '2021-03-03 17:49:55.590512', 1, '/admin/space/type/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (329, '2021-03-03 17:49:55.856996', '2021-03-03 17:49:55.856996', 1, '/admin/space/info/page', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":12,\"total\":0,\"classifyId\":null}');
INSERT INTO `base_sys_log` VALUES (330, '2021-03-03 17:50:04.485964', '2021-03-03 17:50:04.485964', 1, '/admin/base/sys/param/update', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"name\":\"富文本参数\",\"keyName\":\"text\",\"data\":\"<p><strong class=\\\"ql-size-huge\\\">111xxxxx2222<span class=\\\"ql-cursor\\\">﻿﻿</span></strong></p>\",\"remark\":null,\"id\":1,\"createTime\":\"2021-02-26 13:53:05\",\"updateTime\":\"2021-02-26 13:53:05\",\"dataType\":0}');
INSERT INTO `base_sys_log` VALUES (331, '2021-03-03 17:50:04.860012', '2021-03-03 17:50:04.860012', 1, '/admin/base/sys/param/page', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true}');
INSERT INTO `base_sys_log` VALUES (332, '2021-03-03 17:51:02.244290', '2021-03-03 17:51:02.244290', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (333, '2021-03-03 17:51:03.016750', '2021-03-03 17:51:03.016750', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (334, '2021-03-03 17:51:33.635048', '2021-03-03 17:51:33.635048', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (335, '2021-03-03 17:51:34.778061', '2021-03-03 17:51:34.778061', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (336, '2021-03-03 17:51:35.607713', '2021-03-03 17:51:35.607713', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (337, '2021-03-03 17:51:36.557430', '2021-03-03 17:51:36.557430', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (338, '2021-03-03 17:51:38.534901', '2021-03-03 17:51:38.534901', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (339, '2021-03-03 17:51:42.445085', '2021-03-03 17:51:42.445085', 1, '/admin/base/comm/uploadMode', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (340, '2021-03-03 17:51:42.688119', '2021-03-03 17:51:42.688119', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (341, '2021-03-03 17:51:42.723989', '2021-03-03 17:51:42.723989', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (342, '2021-03-03 17:51:43.263086', '2021-03-03 17:51:43.263086', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (343, '2021-03-03 17:51:45.870745', '2021-03-03 17:51:45.870745', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (344, '2021-03-03 17:51:45.915179', '2021-03-03 17:51:45.915179', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (345, '2021-03-03 17:51:45.918331', '2021-03-03 17:51:45.918331', 1, '/admin/base/comm/uploadMode', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (346, '2021-03-03 17:51:46.414446', '2021-03-03 17:51:46.414446', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (347, '2021-03-03 17:51:47.576265', '2021-03-03 17:51:47.576265', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (348, '2021-03-03 17:51:55.432795', '2021-03-03 17:51:55.432795', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (349, '2021-03-03 17:51:55.451780', '2021-03-03 17:51:55.451780', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (350, '2021-03-03 17:51:55.486381', '2021-03-03 17:51:55.486381', 1, '/admin/base/comm/uploadMode', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (351, '2021-03-03 17:51:55.994881', '2021-03-03 17:51:55.994881', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (352, '2021-03-03 17:51:57.484227', '2021-03-03 17:51:57.484227', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (353, '2021-03-03 17:52:12.979547', '2021-03-03 17:52:12.979547', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (354, '2021-03-03 17:52:13.744398', '2021-03-03 17:52:13.744398', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (355, '2021-03-03 17:53:46.349081', '2021-03-03 17:53:46.349081', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (356, '2021-03-03 17:53:48.376525', '2021-03-03 17:53:48.376525', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (357, '2021-03-03 18:06:23.394068', '2021-03-03 18:06:23.394068', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (358, '2021-03-03 18:06:26.477775', '2021-03-03 18:06:26.477775', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"1bdb94d0-7c08-11eb-8e14-a5ae9204e611\",\"verifyCode\":\"8136\"}');
INSERT INTO `base_sys_log` VALUES (359, '2021-03-03 18:06:26.749698', '2021-03-03 18:06:26.749698', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (360, '2021-03-03 18:06:27.028026', '2021-03-03 18:06:27.028026', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (361, '2021-03-03 18:06:31.426046', '2021-03-03 18:06:31.426046', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (362, '2021-03-03 18:06:34.296691', '2021-03-03 18:06:34.296691', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (363, '2021-03-03 18:06:35.209903', '2021-03-03 18:06:35.209903', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (364, '2021-03-03 18:06:55.955985', '2021-03-03 18:06:55.955985', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (365, '2021-03-03 18:10:56.466111', '2021-03-03 18:10:56.466111', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (366, '2021-03-03 18:11:28.996304', '2021-03-03 18:11:28.996304', NULL, '/admin/base/open/captcha', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"height\":\"36\",\"width\":\"110\"}');
INSERT INTO `base_sys_log` VALUES (367, '2021-03-03 18:12:01.521951', '2021-03-03 18:12:01.521951', NULL, '/admin/base/open/login', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"username\":\"admin\",\"password\":\"123456\",\"captchaId\":\"d201fba0-7c08-11eb-8bd3-15193791082f\",\"verifyCode\":\"3034\"}');
INSERT INTO `base_sys_log` VALUES (368, '2021-03-03 18:12:01.820231', '2021-03-03 18:12:01.820231', 1, '/admin/base/comm/person', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (369, '2021-03-03 18:12:02.067010', '2021-03-03 18:12:02.067010', 1, '/admin/base/comm/permmenu', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', NULL);
INSERT INTO `base_sys_log` VALUES (370, '2021-03-03 18:12:35.151542', '2021-03-03 18:12:35.151542', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (371, '2021-03-03 18:12:36.936516', '2021-03-03 18:12:36.936516', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (372, '2021-03-03 18:12:39.078066', '2021-03-03 18:12:39.078066', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
INSERT INTO `base_sys_log` VALUES (373, '2021-03-03 18:12:45.957592', '2021-03-03 18:12:45.957592', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (374, '2021-03-03 18:12:47.062692', '2021-03-03 18:12:47.062692', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (375, '2021-03-03 18:12:47.852967', '2021-03-03 18:12:47.852967', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (376, '2021-03-03 18:12:48.452300', '2021-03-03 18:12:48.452300', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (377, '2021-03-03 18:12:50.109412', '2021-03-03 18:12:50.109412', 1, '/admin/base/plugin/info/list', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"page\":1,\"size\":20,\"isTrusted\":true,\"sort\":\"desc\",\"order\":\"createTime\"}');
INSERT INTO `base_sys_log` VALUES (378, '2021-03-03 18:12:58.119556', '2021-03-03 18:12:58.119556', 1, '/admin/base/plugin/info/getConfig', '117.30.38.56,127.0.0.1, 117.30.114.56', '中国福建厦门,本机地址,中国福建厦门', '{\"namespace\":\"redis\"}');
COMMIT;

-- ----------------------------
-- Table structure for base_sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `base_sys_menu`;
CREATE TABLE `base_sys_menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `parentId` bigint(20) DEFAULT NULL COMMENT '父菜单ID',
  `name` varchar(255) NOT NULL COMMENT '菜单名称',
  `router` varchar(255) DEFAULT NULL COMMENT '菜单地址',
  `perms` varchar(255) DEFAULT NULL COMMENT '权限标识',
  `type` tinyint(4) NOT NULL DEFAULT '0' COMMENT '类型 0：目录 1：菜单 2：按钮',
  `icon` varchar(255) DEFAULT NULL COMMENT '图标',
  `orderNum` int(11) NOT NULL DEFAULT '0' COMMENT '排序',
  `viewPath` varchar(255) DEFAULT NULL COMMENT '视图地址',
  `keepAlive` tinyint(4) NOT NULL DEFAULT '1' COMMENT '路由缓存',
  `isShow` tinyint(4) NOT NULL DEFAULT '1' COMMENT '父菜单名称',
  `moduleName` varchar(255) DEFAULT NULL COMMENT '模块名',
  PRIMARY KEY (`id`),
  KEY `IDX_05e3d6a56604771a6da47ebf8e` (`createTime`),
  KEY `IDX_d5203f18daaf7c3fe0ab34497f` (`updateTime`)
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of base_sys_menu
-- ----------------------------
BEGIN;
INSERT INTO `base_sys_menu` VALUES (1, '2019-09-11 11:14:44.000000', '2019-11-18 15:56:36.000000', NULL, '工作台', '/', NULL, 0, 'icon-workbench', 1, NULL, 1, 1, '');
INSERT INTO `base_sys_menu` VALUES (2, '2019-09-11 11:14:47.000000', '2021-02-27 17:16:05.000000', NULL, '系统管理', '/sys', NULL, 0, 'icon-system', 2, NULL, 1, 1, '');
INSERT INTO `base_sys_menu` VALUES (8, '1900-01-20 23:19:57.000000', '2019-09-12 15:53:39.000000', 27, '菜单列表', '/sys/menu', NULL, 1, 'icon-menu', 2, 'cool/components/base/views/menu.vue', 1, 1, 'sys-menu');
INSERT INTO `base_sys_menu` VALUES (10, '1900-01-20 00:19:27.325000', '1900-01-20 00:19:27.325000', 8, '新增', NULL, 'base:sys:menu:add', 2, NULL, 1, NULL, 0, 1, '');
INSERT INTO `base_sys_menu` VALUES (11, '1900-01-20 00:19:51.101000', '1900-01-20 00:19:51.101000', 8, '删除', NULL, 'base:sys:menu:delete', 2, NULL, 2, NULL, 0, 1, '');
INSERT INTO `base_sys_menu` VALUES (12, '1900-01-20 00:20:05.150000', '1900-01-20 00:20:05.150000', 8, '修改', NULL, 'base:sys:menu:update', 2, NULL, 3, NULL, 0, 1, '');
INSERT INTO `base_sys_menu` VALUES (13, '1900-01-20 00:20:19.341000', '1900-01-20 00:20:19.341000', 8, '查询', NULL, 'base:sys:menu:page,base:sys:menu:list,base:sys:menu:info', 2, NULL, 4, NULL, 0, 1, '');
INSERT INTO `base_sys_menu` VALUES (22, '2019-09-12 00:34:01.000000', '2019-09-15 23:47:27.000000', 27, '角色列表', '/sys/role', NULL, 1, 'icon-common', 3, 'cool/components/base/views/role.vue', 1, 1, 'sys-role');
INSERT INTO `base_sys_menu` VALUES (23, '1900-01-20 00:34:23.459000', '1900-01-20 00:34:23.459000', 22, '新增', NULL, 'base:sys:role:add', 2, NULL, 1, NULL, 0, 1, '');
INSERT INTO `base_sys_menu` VALUES (24, '1900-01-20 00:34:40.523000', '1900-01-20 00:34:40.523000', 22, '删除', NULL, 'base:sys:role:delete', 2, NULL, 2, NULL, 0, 1, '');
INSERT INTO `base_sys_menu` VALUES (25, '1900-01-20 00:34:53.306000', '1900-01-20 00:34:53.306000', 22, '修改', NULL, 'base:sys:role:update', 2, NULL, 3, NULL, 0, 1, '');
INSERT INTO `base_sys_menu` VALUES (26, '1900-01-20 00:35:05.024000', '1900-01-20 00:35:05.024000', 22, '查询', NULL, 'base:sys:role:page,base:sys:role:list,base:sys:role:info', 2, NULL, 4, NULL, 0, 1, '');
INSERT INTO `base_sys_menu` VALUES (27, '2019-09-12 15:52:44.000000', '2019-09-15 22:11:56.000000', 2, '权限管理', NULL, NULL, 0, 'icon-auth', 1, NULL, 0, 1, '');
INSERT INTO `base_sys_menu` VALUES (29, '2019-09-12 17:35:51.000000', '2019-11-26 23:46:53.000000', 105, '请求日志', '/sys/log', NULL, 1, 'icon-log', 1, 'cool/components/log/views/log.vue', 1, 1, 'sys.log');
INSERT INTO `base_sys_menu` VALUES (30, '2019-09-12 17:37:03.000000', '2021-03-03 10:16:26.000000', 29, '权限', NULL, 'base:sys:log:page,base:sys:log:clear,base:sys:log:getKeep,base:sys:log:setKeep', 2, NULL, 1, NULL, 0, 1, '');
INSERT INTO `base_sys_menu` VALUES (43, '2019-11-07 14:22:34.000000', '2021-02-27 14:22:23.000000', 45, 'crud 示例', '/crud', NULL, 1, 'icon-favor', 1, 'cool/components/demo/views/crud.vue', 1, 1, 'crud');
INSERT INTO `base_sys_menu` VALUES (45, '2019-11-07 22:36:57.000000', '2019-11-11 15:21:10.000000', 1, '组件库', '/ui-lib', NULL, 0, 'icon-common', 2, NULL, 1, 1, '');
INSERT INTO `base_sys_menu` VALUES (47, '2019-11-08 09:35:08.000000', '2021-02-27 17:16:35.000000', NULL, '框架教程', '/tutorial', NULL, 0, 'icon-task', 4, NULL, 1, 1, '');
INSERT INTO `base_sys_menu` VALUES (48, '2019-11-08 09:35:53.000000', '2021-03-03 11:03:21.000000', 47, '文档', '/tutorial/doc', NULL, 1, 'icon-log', 0, 'https://admin.cool-js.com', 1, 1, '');
INSERT INTO `base_sys_menu` VALUES (49, '2019-11-09 22:11:13.000000', '2021-02-27 14:22:28.000000', 45, 'quill 富文本编辑器', '/editor-quill', NULL, 1, 'icon-favor', 2, 'cool/components/demo/views/editor-quill.vue', 1, 1, 'editor-quill');
INSERT INTO `base_sys_menu` VALUES (59, '2019-11-18 16:50:27.000000', '2019-11-18 16:50:27.000000', 97, '部门列表', NULL, 'base:sys:department:list', 2, NULL, 0, NULL, 1, 1, '');
INSERT INTO `base_sys_menu` VALUES (60, '2019-11-18 16:50:45.000000', '2019-11-18 16:50:45.000000', 97, '新增部门', NULL, 'base:sys:department:add', 2, NULL, 0, NULL, 1, 1, '');
INSERT INTO `base_sys_menu` VALUES (61, '2019-11-18 16:50:59.000000', '2019-11-18 16:50:59.000000', 97, '更新部门', NULL, 'base:sys:department:update', 2, NULL, 0, NULL, 1, 1, '');
INSERT INTO `base_sys_menu` VALUES (62, '2019-11-18 16:51:13.000000', '2019-11-18 16:51:13.000000', 97, '删除部门', NULL, 'base:sys:department:delete', 2, NULL, 0, NULL, 1, 1, '');
INSERT INTO `base_sys_menu` VALUES (63, '2019-11-18 17:49:35.000000', '2019-11-18 17:49:35.000000', 97, '部门排序', NULL, 'base:sys:department:order', 2, NULL, 0, NULL, 1, 1, '');
INSERT INTO `base_sys_menu` VALUES (65, '2019-11-18 23:59:21.000000', '2019-11-18 23:59:21.000000', 97, '用户转移', NULL, 'base:sys:user:move', 2, NULL, 0, NULL, 1, 1, '');
INSERT INTO `base_sys_menu` VALUES (78, '2019-12-10 13:27:56.000000', '2021-02-27 17:08:53.000000', 2, '参数配置', NULL, NULL, 0, 'icon-common', 4, NULL, 1, 1, '');
INSERT INTO `base_sys_menu` VALUES (79, '1900-01-20 13:29:33.000000', '1900-01-20 13:29:33.000000', 78, '参数列表', '/sys/param', NULL, 1, 'icon-menu', 0, 'cool/components/param/views/param.vue', 1, 1, 'sys.param');
INSERT INTO `base_sys_menu` VALUES (80, '1900-01-20 13:29:50.146000', '1900-01-20 13:29:50.146000', 79, '新增', NULL, 'base:sys:param:add', 2, NULL, 0, NULL, 1, 1, '');
INSERT INTO `base_sys_menu` VALUES (81, '1900-01-20 13:30:10.030000', '1900-01-20 13:30:10.030000', 79, '修改', NULL, 'base:sys:param:info,base:sys:param:update', 2, NULL, 0, NULL, 1, 1, '');
INSERT INTO `base_sys_menu` VALUES (82, '1900-01-20 13:30:25.791000', '1900-01-20 13:30:25.791000', 79, '删除', NULL, 'base:sys:param:delete', 2, NULL, 0, NULL, 1, 1, '');
INSERT INTO `base_sys_menu` VALUES (83, '1900-01-20 13:30:40.469000', '1900-01-20 13:30:40.469000', 79, '查看', NULL, 'base:sys:param:page,base:sys:param:list,base:sys:param:info', 2, NULL, 0, NULL, 1, 1, '');
INSERT INTO `base_sys_menu` VALUES (84, '2020-07-25 16:21:30.000000', '2020-07-25 16:21:30.000000', NULL, '通用', NULL, NULL, 0, 'icon-radioboxfill', 99, NULL, 1, 0, '');
INSERT INTO `base_sys_menu` VALUES (85, '2020-07-25 16:22:14.000000', '2021-03-03 10:36:00.000000', 84, '图片上传', NULL, 'space:info:page,space:info:list,space:info:info,space:info:add,space:info:delete,space:info:update,space:type:page,space:type:list,space:type:info,space:type:add,space:type:delete,space:type:update', 2, NULL, 1, NULL, 1, 1, '');
INSERT INTO `base_sys_menu` VALUES (86, '2020-08-12 09:56:27.000000', '2021-02-27 14:22:35.000000', 45, '文件上传', '/upload', NULL, 1, 'icon-favor', 3, 'cool/components/demo/views/upload.vue', 1, 1, 'upload');
INSERT INTO `base_sys_menu` VALUES (90, '1900-01-20 10:26:58.615000', '1900-01-20 10:26:58.615000', 84, '客服聊天', NULL, 'base:app:im:message:read,base:app:im:message:page,base:app:im:session:page,base:app:im:session:list,base:app:im:session:unreadCount,base:app:im:session:delete', 2, NULL, 0, NULL, 1, 1, '');
INSERT INTO `base_sys_menu` VALUES (96, '2021-01-12 14:12:20.000000', '2021-02-27 14:22:17.000000', 1, '组件预览', '/demo', NULL, 1, 'icon-favor', 0, 'cool/components/demo/views/demo.vue', 1, 1, 'demo');
INSERT INTO `base_sys_menu` VALUES (97, '1900-01-20 14:14:02.000000', '2021-02-27 14:18:22.000000', 27, '用户列表', '/sys/user', NULL, 1, 'icon-user', 0, 'cool/components/base/views/user.vue', 1, 1, 'sys-user');
INSERT INTO `base_sys_menu` VALUES (98, '1900-01-20 14:14:13.528000', '1900-01-20 14:14:13.528000', 97, '新增', NULL, 'base:sys:user:add', 2, NULL, 0, NULL, 1, 1, '');
INSERT INTO `base_sys_menu` VALUES (99, '1900-01-20 14:14:22.823000', '1900-01-20 14:14:22.823000', 97, '删除', NULL, 'base:sys:user:delete', 2, NULL, 0, NULL, 1, 1, '');
INSERT INTO `base_sys_menu` VALUES (100, '1900-01-20 14:14:33.973000', '1900-01-20 14:14:33.973000', 97, '修改', NULL, 'base:sys:user:delete,base:sys:user:update', 2, NULL, 0, NULL, 1, 1, '');
INSERT INTO `base_sys_menu` VALUES (101, '2021-01-12 14:14:51.000000', '2021-01-12 14:14:51.000000', 97, '查询', NULL, 'base:sys:user:page,base:sys:user:list,base:sys:user:info', 2, NULL, 0, NULL, 1, 1, '');
INSERT INTO `base_sys_menu` VALUES (105, '2021-01-21 10:42:55.000000', '2021-01-21 10:42:55.000000', 2, '监控管理', NULL, NULL, 0, 'icon-rank', 6, NULL, 1, 1, '');
INSERT INTO `base_sys_menu` VALUES (109, '2021-02-27 14:13:56.000000', '2021-02-27 17:09:19.000000', NULL, '插件管理', NULL, NULL, 0, 'icon-menu', 3, NULL, 1, 1, NULL);
INSERT INTO `base_sys_menu` VALUES (110, '2021-02-27 14:14:13.000000', '2021-02-27 14:14:13.000000', 109, '插件列表', '/plugin', NULL, 1, 'icon-menu', 0, 'cool/components/base/views/plugin.vue', 1, 1, 'plugin');
INSERT INTO `base_sys_menu` VALUES (111, '2021-02-27 14:24:41.877000', '2021-02-27 14:24:41.877000', 110, '编辑', NULL, 'base:plugin:info:info,base:plugin:info:update', 2, NULL, 0, NULL, 1, 1, NULL);
INSERT INTO `base_sys_menu` VALUES (112, '2021-02-27 14:24:52.159000', '2021-02-27 14:24:52.159000', 110, '列表', NULL, 'base:plugin:info:list', 2, NULL, 0, NULL, 1, 1, NULL);
INSERT INTO `base_sys_menu` VALUES (113, '2021-02-27 14:25:02.066000', '2021-02-27 14:25:02.066000', 110, '删除', NULL, 'base:plugin:info:delete', 2, NULL, 0, NULL, 1, 1, NULL);
INSERT INTO `base_sys_menu` VALUES (114, '2021-02-27 16:36:59.322000', '2021-02-27 16:36:59.322000', 110, '保存配置', NULL, 'base:plugin:info:config', 2, NULL, 0, NULL, 1, 1, NULL);
INSERT INTO `base_sys_menu` VALUES (115, '2021-02-27 16:38:21.000000', '2021-02-27 18:18:22.000000', 110, '获取配置', NULL, 'base:plugin:info:getConfig', 2, NULL, 0, NULL, 1, 1, NULL);
INSERT INTO `base_sys_menu` VALUES (116, '2021-02-27 17:57:42.000000', '2021-02-27 18:19:35.000000', 110, '开启、关闭', NULL, 'base:plugin:info:enable', 2, NULL, 0, NULL, 1, 1, NULL);
COMMIT;

-- ----------------------------
-- Table structure for base_sys_param
-- ----------------------------
DROP TABLE IF EXISTS `base_sys_param`;
CREATE TABLE `base_sys_param` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `keyName` varchar(255) NOT NULL COMMENT '键位',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `data` text NOT NULL COMMENT '数据',
  `dataType` tinyint(4) NOT NULL DEFAULT '0' COMMENT '数据类型 0:字符串 1：数组 2：键值对',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`),
  KEY `IDX_cf19b5e52d8c71caa9c4534454` (`keyName`),
  KEY `IDX_7bcb57371b481d8e2d66ddeaea` (`createTime`),
  KEY `IDX_479122e3bf464112f7a7253dac` (`updateTime`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of base_sys_param
-- ----------------------------
BEGIN;
INSERT INTO `base_sys_param` VALUES (1, '2021-02-26 13:53:05.000000', '2021-03-03 17:50:04.000000', 'text', '富文本参数', '<p><strong class=\"ql-size-huge\">111xxxxx2222<span class=\"ql-cursor\">﻿﻿</span></strong></p>', 0, NULL);
INSERT INTO `base_sys_param` VALUES (2, '2021-02-26 13:53:18.000000', '2021-02-26 13:53:18.000000', 'json', 'JSON参数', '{\n    code: 111\n}', 0, NULL);
COMMIT;

-- ----------------------------
-- Table structure for base_sys_role
-- ----------------------------
DROP TABLE IF EXISTS `base_sys_role`;
CREATE TABLE `base_sys_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `userId` varchar(255) NOT NULL COMMENT '用户ID',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `label` varchar(50) DEFAULT NULL COMMENT '角色标签',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `relevance` int(11) NOT NULL DEFAULT '1' COMMENT '数据权限是否关联上下级',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_469d49a5998170e9550cf113da` (`name`),
  UNIQUE KEY `IDX_f3f24fbbccf00192b076e549a7` (`label`),
  KEY `IDX_6f01184441dec49207b41bfd92` (`createTime`),
  KEY `IDX_d64ca209f3fc52128d9b20e97b` (`updateTime`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of base_sys_role
-- ----------------------------
BEGIN;
INSERT INTO `base_sys_role` VALUES (1, '2021-02-24 21:18:39.682358', '2021-02-24 21:18:39.682358', '1', '超管', 'admin', '最高权限的角色', 1);
INSERT INTO `base_sys_role` VALUES (10, '2021-02-26 14:15:38.000000', '2021-02-26 14:15:38.000000', '1', '系统管理员', 'admin-sys', NULL, 1);
INSERT INTO `base_sys_role` VALUES (11, '2021-02-26 14:16:49.044744', '2021-02-26 14:16:49.044744', '1', '游客', 'visitor', NULL, 0);
INSERT INTO `base_sys_role` VALUES (12, '2021-02-26 14:26:51.000000', '2021-02-26 14:32:35.000000', '1', '开发', 'dev', NULL, 0);
INSERT INTO `base_sys_role` VALUES (13, '2021-02-26 14:27:58.000000', '2021-02-26 14:33:49.000000', '1', '测试', 'test', NULL, 0);
COMMIT;

-- ----------------------------
-- Table structure for base_sys_role_department
-- ----------------------------
DROP TABLE IF EXISTS `base_sys_role_department`;
CREATE TABLE `base_sys_role_department` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `roleId` bigint(20) NOT NULL COMMENT '角色ID',
  `departmentId` bigint(20) NOT NULL COMMENT '部门ID',
  PRIMARY KEY (`id`),
  KEY `IDX_e881a66f7cce83ba431cf20194` (`createTime`),
  KEY `IDX_cbf48031efee5d0de262965e53` (`updateTime`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of base_sys_role_department
-- ----------------------------
BEGIN;
INSERT INTO `base_sys_role_department` VALUES (1, '2021-02-26 12:00:23.787939', '2021-02-26 12:00:23.787939', 8, 4);
INSERT INTO `base_sys_role_department` VALUES (2, '2021-02-26 12:01:11.525205', '2021-02-26 12:01:11.525205', 9, 1);
INSERT INTO `base_sys_role_department` VALUES (3, '2021-02-26 12:01:11.624266', '2021-02-26 12:01:11.624266', 9, 4);
INSERT INTO `base_sys_role_department` VALUES (4, '2021-02-26 12:01:11.721894', '2021-02-26 12:01:11.721894', 9, 5);
INSERT INTO `base_sys_role_department` VALUES (5, '2021-02-26 12:01:11.823342', '2021-02-26 12:01:11.823342', 9, 8);
INSERT INTO `base_sys_role_department` VALUES (6, '2021-02-26 12:01:11.922873', '2021-02-26 12:01:11.922873', 9, 9);
INSERT INTO `base_sys_role_department` VALUES (23, '2021-02-26 14:32:40.354669', '2021-02-26 14:32:40.354669', 12, 11);
INSERT INTO `base_sys_role_department` VALUES (25, '2021-02-26 14:32:59.726608', '2021-02-26 14:32:59.726608', 10, 1);
INSERT INTO `base_sys_role_department` VALUES (27, '2021-02-26 14:33:54.579947', '2021-02-26 14:33:54.579947', 13, 12);
COMMIT;

-- ----------------------------
-- Table structure for base_sys_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `base_sys_role_menu`;
CREATE TABLE `base_sys_role_menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `roleId` bigint(20) NOT NULL COMMENT '角色ID',
  `menuId` bigint(20) NOT NULL COMMENT '菜单ID',
  PRIMARY KEY (`id`),
  KEY `IDX_3641f81d4201c524a57ce2aa54` (`createTime`),
  KEY `IDX_f860298298b26e7a697be36e5b` (`updateTime`)
) ENGINE=InnoDB AUTO_INCREMENT=517 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of base_sys_role_menu
-- ----------------------------
BEGIN;
INSERT INTO `base_sys_role_menu` VALUES (1, '2021-02-26 12:00:18.240154', '2021-02-26 12:00:18.240154', 8, 1);
INSERT INTO `base_sys_role_menu` VALUES (2, '2021-02-26 12:00:18.342131', '2021-02-26 12:00:18.342131', 8, 96);
INSERT INTO `base_sys_role_menu` VALUES (3, '2021-02-26 12:00:18.444143', '2021-02-26 12:00:18.444143', 8, 45);
INSERT INTO `base_sys_role_menu` VALUES (4, '2021-02-26 12:00:18.545490', '2021-02-26 12:00:18.545490', 8, 43);
INSERT INTO `base_sys_role_menu` VALUES (5, '2021-02-26 12:00:18.649626', '2021-02-26 12:00:18.649626', 8, 49);
INSERT INTO `base_sys_role_menu` VALUES (6, '2021-02-26 12:00:18.752369', '2021-02-26 12:00:18.752369', 8, 86);
INSERT INTO `base_sys_role_menu` VALUES (7, '2021-02-26 12:00:18.856023', '2021-02-26 12:00:18.856023', 8, 2);
INSERT INTO `base_sys_role_menu` VALUES (8, '2021-02-26 12:00:18.956131', '2021-02-26 12:00:18.956131', 8, 27);
INSERT INTO `base_sys_role_menu` VALUES (9, '2021-02-26 12:00:19.071490', '2021-02-26 12:00:19.071490', 8, 97);
INSERT INTO `base_sys_role_menu` VALUES (10, '2021-02-26 12:00:19.171745', '2021-02-26 12:00:19.171745', 8, 59);
INSERT INTO `base_sys_role_menu` VALUES (11, '2021-02-26 12:00:19.274495', '2021-02-26 12:00:19.274495', 8, 60);
INSERT INTO `base_sys_role_menu` VALUES (12, '2021-02-26 12:00:19.374610', '2021-02-26 12:00:19.374610', 8, 61);
INSERT INTO `base_sys_role_menu` VALUES (13, '2021-02-26 12:00:19.474750', '2021-02-26 12:00:19.474750', 8, 62);
INSERT INTO `base_sys_role_menu` VALUES (14, '2021-02-26 12:00:19.573369', '2021-02-26 12:00:19.573369', 8, 63);
INSERT INTO `base_sys_role_menu` VALUES (15, '2021-02-26 12:00:19.674242', '2021-02-26 12:00:19.674242', 8, 65);
INSERT INTO `base_sys_role_menu` VALUES (16, '2021-02-26 12:00:19.772886', '2021-02-26 12:00:19.772886', 8, 98);
INSERT INTO `base_sys_role_menu` VALUES (17, '2021-02-26 12:00:19.874134', '2021-02-26 12:00:19.874134', 8, 99);
INSERT INTO `base_sys_role_menu` VALUES (18, '2021-02-26 12:00:19.972728', '2021-02-26 12:00:19.972728', 8, 100);
INSERT INTO `base_sys_role_menu` VALUES (19, '2021-02-26 12:00:20.085877', '2021-02-26 12:00:20.085877', 8, 101);
INSERT INTO `base_sys_role_menu` VALUES (20, '2021-02-26 12:00:20.192887', '2021-02-26 12:00:20.192887', 8, 8);
INSERT INTO `base_sys_role_menu` VALUES (21, '2021-02-26 12:00:20.293747', '2021-02-26 12:00:20.293747', 8, 10);
INSERT INTO `base_sys_role_menu` VALUES (22, '2021-02-26 12:00:20.393491', '2021-02-26 12:00:20.393491', 8, 11);
INSERT INTO `base_sys_role_menu` VALUES (23, '2021-02-26 12:00:20.495110', '2021-02-26 12:00:20.495110', 8, 12);
INSERT INTO `base_sys_role_menu` VALUES (24, '2021-02-26 12:00:20.594083', '2021-02-26 12:00:20.594083', 8, 13);
INSERT INTO `base_sys_role_menu` VALUES (25, '2021-02-26 12:00:20.695727', '2021-02-26 12:00:20.695727', 8, 22);
INSERT INTO `base_sys_role_menu` VALUES (26, '2021-02-26 12:00:20.794729', '2021-02-26 12:00:20.794729', 8, 23);
INSERT INTO `base_sys_role_menu` VALUES (27, '2021-02-26 12:00:20.895601', '2021-02-26 12:00:20.895601', 8, 24);
INSERT INTO `base_sys_role_menu` VALUES (28, '2021-02-26 12:00:20.994972', '2021-02-26 12:00:20.994972', 8, 25);
INSERT INTO `base_sys_role_menu` VALUES (29, '2021-02-26 12:00:21.110384', '2021-02-26 12:00:21.110384', 8, 26);
INSERT INTO `base_sys_role_menu` VALUES (30, '2021-02-26 12:00:21.210970', '2021-02-26 12:00:21.210970', 8, 69);
INSERT INTO `base_sys_role_menu` VALUES (31, '2021-02-26 12:00:21.311852', '2021-02-26 12:00:21.311852', 8, 70);
INSERT INTO `base_sys_role_menu` VALUES (32, '2021-02-26 12:00:21.411591', '2021-02-26 12:00:21.411591', 8, 71);
INSERT INTO `base_sys_role_menu` VALUES (33, '2021-02-26 12:00:21.513584', '2021-02-26 12:00:21.513584', 8, 72);
INSERT INTO `base_sys_role_menu` VALUES (34, '2021-02-26 12:00:21.612212', '2021-02-26 12:00:21.612212', 8, 73);
INSERT INTO `base_sys_role_menu` VALUES (35, '2021-02-26 12:00:21.712720', '2021-02-26 12:00:21.712720', 8, 74);
INSERT INTO `base_sys_role_menu` VALUES (36, '2021-02-26 12:00:21.812839', '2021-02-26 12:00:21.812839', 8, 75);
INSERT INTO `base_sys_role_menu` VALUES (37, '2021-02-26 12:00:21.913321', '2021-02-26 12:00:21.913321', 8, 76);
INSERT INTO `base_sys_role_menu` VALUES (38, '2021-02-26 12:00:22.013970', '2021-02-26 12:00:22.013970', 8, 77);
INSERT INTO `base_sys_role_menu` VALUES (39, '2021-02-26 12:00:22.144879', '2021-02-26 12:00:22.144879', 8, 78);
INSERT INTO `base_sys_role_menu` VALUES (40, '2021-02-26 12:00:22.246707', '2021-02-26 12:00:22.246707', 8, 79);
INSERT INTO `base_sys_role_menu` VALUES (41, '2021-02-26 12:00:22.347579', '2021-02-26 12:00:22.347579', 8, 80);
INSERT INTO `base_sys_role_menu` VALUES (42, '2021-02-26 12:00:22.446947', '2021-02-26 12:00:22.446947', 8, 81);
INSERT INTO `base_sys_role_menu` VALUES (43, '2021-02-26 12:00:22.547082', '2021-02-26 12:00:22.547082', 8, 82);
INSERT INTO `base_sys_role_menu` VALUES (44, '2021-02-26 12:00:22.647197', '2021-02-26 12:00:22.647197', 8, 83);
INSERT INTO `base_sys_role_menu` VALUES (45, '2021-02-26 12:00:22.748089', '2021-02-26 12:00:22.748089', 8, 105);
INSERT INTO `base_sys_role_menu` VALUES (46, '2021-02-26 12:00:22.847814', '2021-02-26 12:00:22.847814', 8, 102);
INSERT INTO `base_sys_role_menu` VALUES (47, '2021-02-26 12:00:22.949071', '2021-02-26 12:00:22.949071', 8, 103);
INSERT INTO `base_sys_role_menu` VALUES (48, '2021-02-26 12:00:23.047353', '2021-02-26 12:00:23.047353', 8, 29);
INSERT INTO `base_sys_role_menu` VALUES (49, '2021-02-26 12:00:23.147826', '2021-02-26 12:00:23.147826', 8, 30);
INSERT INTO `base_sys_role_menu` VALUES (50, '2021-02-26 12:00:23.246800', '2021-02-26 12:00:23.246800', 8, 47);
INSERT INTO `base_sys_role_menu` VALUES (51, '2021-02-26 12:00:23.349541', '2021-02-26 12:00:23.349541', 8, 48);
INSERT INTO `base_sys_role_menu` VALUES (52, '2021-02-26 12:00:23.463177', '2021-02-26 12:00:23.463177', 8, 84);
INSERT INTO `base_sys_role_menu` VALUES (53, '2021-02-26 12:00:23.564096', '2021-02-26 12:00:23.564096', 8, 90);
INSERT INTO `base_sys_role_menu` VALUES (54, '2021-02-26 12:00:23.663815', '2021-02-26 12:00:23.663815', 8, 85);
INSERT INTO `base_sys_role_menu` VALUES (55, '2021-02-26 12:01:05.971978', '2021-02-26 12:01:05.971978', 9, 1);
INSERT INTO `base_sys_role_menu` VALUES (56, '2021-02-26 12:01:06.085568', '2021-02-26 12:01:06.085568', 9, 96);
INSERT INTO `base_sys_role_menu` VALUES (57, '2021-02-26 12:01:06.198271', '2021-02-26 12:01:06.198271', 9, 45);
INSERT INTO `base_sys_role_menu` VALUES (58, '2021-02-26 12:01:06.309736', '2021-02-26 12:01:06.309736', 9, 43);
INSERT INTO `base_sys_role_menu` VALUES (59, '2021-02-26 12:01:06.410785', '2021-02-26 12:01:06.410785', 9, 49);
INSERT INTO `base_sys_role_menu` VALUES (60, '2021-02-26 12:01:06.510712', '2021-02-26 12:01:06.510712', 9, 86);
INSERT INTO `base_sys_role_menu` VALUES (61, '2021-02-26 12:01:06.612457', '2021-02-26 12:01:06.612457', 9, 2);
INSERT INTO `base_sys_role_menu` VALUES (62, '2021-02-26 12:01:06.710397', '2021-02-26 12:01:06.710397', 9, 27);
INSERT INTO `base_sys_role_menu` VALUES (63, '2021-02-26 12:01:06.809104', '2021-02-26 12:01:06.809104', 9, 97);
INSERT INTO `base_sys_role_menu` VALUES (64, '2021-02-26 12:01:06.907088', '2021-02-26 12:01:06.907088', 9, 59);
INSERT INTO `base_sys_role_menu` VALUES (65, '2021-02-26 12:01:07.009988', '2021-02-26 12:01:07.009988', 9, 60);
INSERT INTO `base_sys_role_menu` VALUES (66, '2021-02-26 12:01:07.122372', '2021-02-26 12:01:07.122372', 9, 61);
INSERT INTO `base_sys_role_menu` VALUES (67, '2021-02-26 12:01:07.223694', '2021-02-26 12:01:07.223694', 9, 62);
INSERT INTO `base_sys_role_menu` VALUES (68, '2021-02-26 12:01:07.325022', '2021-02-26 12:01:07.325022', 9, 63);
INSERT INTO `base_sys_role_menu` VALUES (69, '2021-02-26 12:01:07.425209', '2021-02-26 12:01:07.425209', 9, 65);
INSERT INTO `base_sys_role_menu` VALUES (70, '2021-02-26 12:01:07.522081', '2021-02-26 12:01:07.522081', 9, 98);
INSERT INTO `base_sys_role_menu` VALUES (71, '2021-02-26 12:01:07.622775', '2021-02-26 12:01:07.622775', 9, 99);
INSERT INTO `base_sys_role_menu` VALUES (72, '2021-02-26 12:01:07.721181', '2021-02-26 12:01:07.721181', 9, 100);
INSERT INTO `base_sys_role_menu` VALUES (73, '2021-02-26 12:01:07.819589', '2021-02-26 12:01:07.819589', 9, 101);
INSERT INTO `base_sys_role_menu` VALUES (74, '2021-02-26 12:01:07.920497', '2021-02-26 12:01:07.920497', 9, 8);
INSERT INTO `base_sys_role_menu` VALUES (75, '2021-02-26 12:01:08.018875', '2021-02-26 12:01:08.018875', 9, 10);
INSERT INTO `base_sys_role_menu` VALUES (76, '2021-02-26 12:01:08.135192', '2021-02-26 12:01:08.135192', 9, 11);
INSERT INTO `base_sys_role_menu` VALUES (77, '2021-02-26 12:01:08.246405', '2021-02-26 12:01:08.246405', 9, 12);
INSERT INTO `base_sys_role_menu` VALUES (78, '2021-02-26 12:01:08.346661', '2021-02-26 12:01:08.346661', 9, 13);
INSERT INTO `base_sys_role_menu` VALUES (79, '2021-02-26 12:01:08.448436', '2021-02-26 12:01:08.448436', 9, 22);
INSERT INTO `base_sys_role_menu` VALUES (80, '2021-02-26 12:01:08.547496', '2021-02-26 12:01:08.547496', 9, 23);
INSERT INTO `base_sys_role_menu` VALUES (81, '2021-02-26 12:01:08.648457', '2021-02-26 12:01:08.648457', 9, 24);
INSERT INTO `base_sys_role_menu` VALUES (82, '2021-02-26 12:01:08.750564', '2021-02-26 12:01:08.750564', 9, 25);
INSERT INTO `base_sys_role_menu` VALUES (83, '2021-02-26 12:01:08.851783', '2021-02-26 12:01:08.851783', 9, 26);
INSERT INTO `base_sys_role_menu` VALUES (84, '2021-02-26 12:01:08.950898', '2021-02-26 12:01:08.950898', 9, 69);
INSERT INTO `base_sys_role_menu` VALUES (85, '2021-02-26 12:01:09.061982', '2021-02-26 12:01:09.061982', 9, 70);
INSERT INTO `base_sys_role_menu` VALUES (86, '2021-02-26 12:01:09.165258', '2021-02-26 12:01:09.165258', 9, 71);
INSERT INTO `base_sys_role_menu` VALUES (87, '2021-02-26 12:01:09.266177', '2021-02-26 12:01:09.266177', 9, 72);
INSERT INTO `base_sys_role_menu` VALUES (88, '2021-02-26 12:01:09.366427', '2021-02-26 12:01:09.366427', 9, 73);
INSERT INTO `base_sys_role_menu` VALUES (89, '2021-02-26 12:01:09.467877', '2021-02-26 12:01:09.467877', 9, 74);
INSERT INTO `base_sys_role_menu` VALUES (90, '2021-02-26 12:01:09.568526', '2021-02-26 12:01:09.568526', 9, 75);
INSERT INTO `base_sys_role_menu` VALUES (91, '2021-02-26 12:01:09.668052', '2021-02-26 12:01:09.668052', 9, 76);
INSERT INTO `base_sys_role_menu` VALUES (92, '2021-02-26 12:01:09.766367', '2021-02-26 12:01:09.766367', 9, 77);
INSERT INTO `base_sys_role_menu` VALUES (93, '2021-02-26 12:01:09.866170', '2021-02-26 12:01:09.866170', 9, 78);
INSERT INTO `base_sys_role_menu` VALUES (94, '2021-02-26 12:01:09.963037', '2021-02-26 12:01:09.963037', 9, 79);
INSERT INTO `base_sys_role_menu` VALUES (95, '2021-02-26 12:01:10.082046', '2021-02-26 12:01:10.082046', 9, 80);
INSERT INTO `base_sys_role_menu` VALUES (96, '2021-02-26 12:01:10.185024', '2021-02-26 12:01:10.185024', 9, 81);
INSERT INTO `base_sys_role_menu` VALUES (97, '2021-02-26 12:01:10.283787', '2021-02-26 12:01:10.283787', 9, 82);
INSERT INTO `base_sys_role_menu` VALUES (98, '2021-02-26 12:01:10.382883', '2021-02-26 12:01:10.382883', 9, 83);
INSERT INTO `base_sys_role_menu` VALUES (99, '2021-02-26 12:01:10.481150', '2021-02-26 12:01:10.481150', 9, 105);
INSERT INTO `base_sys_role_menu` VALUES (100, '2021-02-26 12:01:10.579579', '2021-02-26 12:01:10.579579', 9, 102);
INSERT INTO `base_sys_role_menu` VALUES (101, '2021-02-26 12:01:10.679489', '2021-02-26 12:01:10.679489', 9, 103);
INSERT INTO `base_sys_role_menu` VALUES (102, '2021-02-26 12:01:10.777496', '2021-02-26 12:01:10.777496', 9, 29);
INSERT INTO `base_sys_role_menu` VALUES (103, '2021-02-26 12:01:10.878292', '2021-02-26 12:01:10.878292', 9, 30);
INSERT INTO `base_sys_role_menu` VALUES (104, '2021-02-26 12:01:10.977354', '2021-02-26 12:01:10.977354', 9, 47);
INSERT INTO `base_sys_role_menu` VALUES (105, '2021-02-26 12:01:11.097786', '2021-02-26 12:01:11.097786', 9, 48);
INSERT INTO `base_sys_role_menu` VALUES (106, '2021-02-26 12:01:11.201390', '2021-02-26 12:01:11.201390', 9, 84);
INSERT INTO `base_sys_role_menu` VALUES (107, '2021-02-26 12:01:11.302120', '2021-02-26 12:01:11.302120', 9, 90);
INSERT INTO `base_sys_role_menu` VALUES (108, '2021-02-26 12:01:11.402751', '2021-02-26 12:01:11.402751', 9, 85);
INSERT INTO `base_sys_role_menu` VALUES (161, '2021-02-26 14:16:49.162546', '2021-02-26 14:16:49.162546', 11, 1);
INSERT INTO `base_sys_role_menu` VALUES (162, '2021-02-26 14:16:49.257677', '2021-02-26 14:16:49.257677', 11, 96);
INSERT INTO `base_sys_role_menu` VALUES (163, '2021-02-26 14:16:49.356225', '2021-02-26 14:16:49.356225', 11, 45);
INSERT INTO `base_sys_role_menu` VALUES (164, '2021-02-26 14:16:49.450708', '2021-02-26 14:16:49.450708', 11, 43);
INSERT INTO `base_sys_role_menu` VALUES (165, '2021-02-26 14:16:49.543794', '2021-02-26 14:16:49.543794', 11, 49);
INSERT INTO `base_sys_role_menu` VALUES (166, '2021-02-26 14:16:49.636496', '2021-02-26 14:16:49.636496', 11, 86);
INSERT INTO `base_sys_role_menu` VALUES (167, '2021-02-26 14:16:49.728634', '2021-02-26 14:16:49.728634', 11, 47);
INSERT INTO `base_sys_role_menu` VALUES (168, '2021-02-26 14:16:49.824754', '2021-02-26 14:16:49.824754', 11, 48);
INSERT INTO `base_sys_role_menu` VALUES (169, '2021-02-26 14:16:49.919329', '2021-02-26 14:16:49.919329', 11, 85);
INSERT INTO `base_sys_role_menu` VALUES (170, '2021-02-26 14:16:50.015239', '2021-02-26 14:16:50.015239', 11, 84);
INSERT INTO `base_sys_role_menu` VALUES (290, '2021-02-26 14:32:35.143867', '2021-02-26 14:32:35.143867', 12, 1);
INSERT INTO `base_sys_role_menu` VALUES (291, '2021-02-26 14:32:35.239965', '2021-02-26 14:32:35.239965', 12, 96);
INSERT INTO `base_sys_role_menu` VALUES (292, '2021-02-26 14:32:35.336398', '2021-02-26 14:32:35.336398', 12, 45);
INSERT INTO `base_sys_role_menu` VALUES (293, '2021-02-26 14:32:35.435180', '2021-02-26 14:32:35.435180', 12, 43);
INSERT INTO `base_sys_role_menu` VALUES (294, '2021-02-26 14:32:35.528631', '2021-02-26 14:32:35.528631', 12, 49);
INSERT INTO `base_sys_role_menu` VALUES (295, '2021-02-26 14:32:35.623123', '2021-02-26 14:32:35.623123', 12, 86);
INSERT INTO `base_sys_role_menu` VALUES (296, '2021-02-26 14:32:35.718831', '2021-02-26 14:32:35.718831', 12, 2);
INSERT INTO `base_sys_role_menu` VALUES (297, '2021-02-26 14:32:35.812975', '2021-02-26 14:32:35.812975', 12, 27);
INSERT INTO `base_sys_role_menu` VALUES (298, '2021-02-26 14:32:35.904487', '2021-02-26 14:32:35.904487', 12, 97);
INSERT INTO `base_sys_role_menu` VALUES (299, '2021-02-26 14:32:35.998773', '2021-02-26 14:32:35.998773', 12, 59);
INSERT INTO `base_sys_role_menu` VALUES (300, '2021-02-26 14:32:36.107749', '2021-02-26 14:32:36.107749', 12, 60);
INSERT INTO `base_sys_role_menu` VALUES (301, '2021-02-26 14:32:36.213069', '2021-02-26 14:32:36.213069', 12, 61);
INSERT INTO `base_sys_role_menu` VALUES (302, '2021-02-26 14:32:36.308985', '2021-02-26 14:32:36.308985', 12, 62);
INSERT INTO `base_sys_role_menu` VALUES (303, '2021-02-26 14:32:36.404237', '2021-02-26 14:32:36.404237', 12, 63);
INSERT INTO `base_sys_role_menu` VALUES (304, '2021-02-26 14:32:36.499569', '2021-02-26 14:32:36.499569', 12, 65);
INSERT INTO `base_sys_role_menu` VALUES (305, '2021-02-26 14:32:36.593710', '2021-02-26 14:32:36.593710', 12, 98);
INSERT INTO `base_sys_role_menu` VALUES (306, '2021-02-26 14:32:36.685988', '2021-02-26 14:32:36.685988', 12, 99);
INSERT INTO `base_sys_role_menu` VALUES (307, '2021-02-26 14:32:36.778733', '2021-02-26 14:32:36.778733', 12, 100);
INSERT INTO `base_sys_role_menu` VALUES (308, '2021-02-26 14:32:36.874715', '2021-02-26 14:32:36.874715', 12, 101);
INSERT INTO `base_sys_role_menu` VALUES (309, '2021-02-26 14:32:36.973153', '2021-02-26 14:32:36.973153', 12, 8);
INSERT INTO `base_sys_role_menu` VALUES (310, '2021-02-26 14:32:37.082734', '2021-02-26 14:32:37.082734', 12, 10);
INSERT INTO `base_sys_role_menu` VALUES (311, '2021-02-26 14:32:37.176859', '2021-02-26 14:32:37.176859', 12, 11);
INSERT INTO `base_sys_role_menu` VALUES (312, '2021-02-26 14:32:37.271440', '2021-02-26 14:32:37.271440', 12, 12);
INSERT INTO `base_sys_role_menu` VALUES (313, '2021-02-26 14:32:37.365206', '2021-02-26 14:32:37.365206', 12, 13);
INSERT INTO `base_sys_role_menu` VALUES (314, '2021-02-26 14:32:37.457092', '2021-02-26 14:32:37.457092', 12, 22);
INSERT INTO `base_sys_role_menu` VALUES (315, '2021-02-26 14:32:37.549860', '2021-02-26 14:32:37.549860', 12, 23);
INSERT INTO `base_sys_role_menu` VALUES (316, '2021-02-26 14:32:37.645684', '2021-02-26 14:32:37.645684', 12, 24);
INSERT INTO `base_sys_role_menu` VALUES (317, '2021-02-26 14:32:37.743370', '2021-02-26 14:32:37.743370', 12, 25);
INSERT INTO `base_sys_role_menu` VALUES (318, '2021-02-26 14:32:37.837218', '2021-02-26 14:32:37.837218', 12, 26);
INSERT INTO `base_sys_role_menu` VALUES (319, '2021-02-26 14:32:37.930953', '2021-02-26 14:32:37.930953', 12, 69);
INSERT INTO `base_sys_role_menu` VALUES (320, '2021-02-26 14:32:38.031191', '2021-02-26 14:32:38.031191', 12, 70);
INSERT INTO `base_sys_role_menu` VALUES (321, '2021-02-26 14:32:38.130839', '2021-02-26 14:32:38.130839', 12, 71);
INSERT INTO `base_sys_role_menu` VALUES (322, '2021-02-26 14:32:38.229359', '2021-02-26 14:32:38.229359', 12, 72);
INSERT INTO `base_sys_role_menu` VALUES (323, '2021-02-26 14:32:38.323868', '2021-02-26 14:32:38.323868', 12, 73);
INSERT INTO `base_sys_role_menu` VALUES (324, '2021-02-26 14:32:38.415194', '2021-02-26 14:32:38.415194', 12, 74);
INSERT INTO `base_sys_role_menu` VALUES (325, '2021-02-26 14:32:38.505597', '2021-02-26 14:32:38.505597', 12, 75);
INSERT INTO `base_sys_role_menu` VALUES (326, '2021-02-26 14:32:38.600426', '2021-02-26 14:32:38.600426', 12, 76);
INSERT INTO `base_sys_role_menu` VALUES (327, '2021-02-26 14:32:38.698676', '2021-02-26 14:32:38.698676', 12, 77);
INSERT INTO `base_sys_role_menu` VALUES (328, '2021-02-26 14:32:38.793832', '2021-02-26 14:32:38.793832', 12, 78);
INSERT INTO `base_sys_role_menu` VALUES (329, '2021-02-26 14:32:38.889203', '2021-02-26 14:32:38.889203', 12, 79);
INSERT INTO `base_sys_role_menu` VALUES (330, '2021-02-26 14:32:38.985851', '2021-02-26 14:32:38.985851', 12, 80);
INSERT INTO `base_sys_role_menu` VALUES (331, '2021-02-26 14:32:39.092110', '2021-02-26 14:32:39.092110', 12, 81);
INSERT INTO `base_sys_role_menu` VALUES (332, '2021-02-26 14:32:39.188945', '2021-02-26 14:32:39.188945', 12, 82);
INSERT INTO `base_sys_role_menu` VALUES (333, '2021-02-26 14:32:39.280043', '2021-02-26 14:32:39.280043', 12, 83);
INSERT INTO `base_sys_role_menu` VALUES (334, '2021-02-26 14:32:39.374899', '2021-02-26 14:32:39.374899', 12, 105);
INSERT INTO `base_sys_role_menu` VALUES (335, '2021-02-26 14:32:39.473563', '2021-02-26 14:32:39.473563', 12, 102);
INSERT INTO `base_sys_role_menu` VALUES (336, '2021-02-26 14:32:39.570921', '2021-02-26 14:32:39.570921', 12, 103);
INSERT INTO `base_sys_role_menu` VALUES (337, '2021-02-26 14:32:39.665052', '2021-02-26 14:32:39.665052', 12, 29);
INSERT INTO `base_sys_role_menu` VALUES (338, '2021-02-26 14:32:39.760189', '2021-02-26 14:32:39.760189', 12, 30);
INSERT INTO `base_sys_role_menu` VALUES (339, '2021-02-26 14:32:39.852856', '2021-02-26 14:32:39.852856', 12, 47);
INSERT INTO `base_sys_role_menu` VALUES (340, '2021-02-26 14:32:39.944180', '2021-02-26 14:32:39.944180', 12, 48);
INSERT INTO `base_sys_role_menu` VALUES (341, '2021-02-26 14:32:40.038086', '2021-02-26 14:32:40.038086', 12, 84);
INSERT INTO `base_sys_role_menu` VALUES (342, '2021-02-26 14:32:40.135874', '2021-02-26 14:32:40.135874', 12, 90);
INSERT INTO `base_sys_role_menu` VALUES (343, '2021-02-26 14:32:40.234015', '2021-02-26 14:32:40.234015', 12, 85);
INSERT INTO `base_sys_role_menu` VALUES (355, '2021-02-26 14:32:54.538822', '2021-02-26 14:32:54.538822', 10, 1);
INSERT INTO `base_sys_role_menu` VALUES (356, '2021-02-26 14:32:54.634784', '2021-02-26 14:32:54.634784', 10, 96);
INSERT INTO `base_sys_role_menu` VALUES (357, '2021-02-26 14:32:54.732878', '2021-02-26 14:32:54.732878', 10, 45);
INSERT INTO `base_sys_role_menu` VALUES (358, '2021-02-26 14:32:54.826023', '2021-02-26 14:32:54.826023', 10, 43);
INSERT INTO `base_sys_role_menu` VALUES (359, '2021-02-26 14:32:54.920173', '2021-02-26 14:32:54.920173', 10, 49);
INSERT INTO `base_sys_role_menu` VALUES (360, '2021-02-26 14:32:55.019141', '2021-02-26 14:32:55.019141', 10, 86);
INSERT INTO `base_sys_role_menu` VALUES (361, '2021-02-26 14:32:55.119438', '2021-02-26 14:32:55.119438', 10, 2);
INSERT INTO `base_sys_role_menu` VALUES (362, '2021-02-26 14:32:55.211471', '2021-02-26 14:32:55.211471', 10, 27);
INSERT INTO `base_sys_role_menu` VALUES (363, '2021-02-26 14:32:55.304855', '2021-02-26 14:32:55.304855', 10, 97);
INSERT INTO `base_sys_role_menu` VALUES (364, '2021-02-26 14:32:55.397939', '2021-02-26 14:32:55.397939', 10, 59);
INSERT INTO `base_sys_role_menu` VALUES (365, '2021-02-26 14:32:55.491674', '2021-02-26 14:32:55.491674', 10, 60);
INSERT INTO `base_sys_role_menu` VALUES (366, '2021-02-26 14:32:55.584051', '2021-02-26 14:32:55.584051', 10, 61);
INSERT INTO `base_sys_role_menu` VALUES (367, '2021-02-26 14:32:55.676449', '2021-02-26 14:32:55.676449', 10, 62);
INSERT INTO `base_sys_role_menu` VALUES (368, '2021-02-26 14:32:55.774524', '2021-02-26 14:32:55.774524', 10, 63);
INSERT INTO `base_sys_role_menu` VALUES (369, '2021-02-26 14:32:55.871634', '2021-02-26 14:32:55.871634', 10, 65);
INSERT INTO `base_sys_role_menu` VALUES (370, '2021-02-26 14:32:55.964611', '2021-02-26 14:32:55.964611', 10, 98);
INSERT INTO `base_sys_role_menu` VALUES (371, '2021-02-26 14:32:56.074043', '2021-02-26 14:32:56.074043', 10, 99);
INSERT INTO `base_sys_role_menu` VALUES (372, '2021-02-26 14:32:56.169316', '2021-02-26 14:32:56.169316', 10, 100);
INSERT INTO `base_sys_role_menu` VALUES (373, '2021-02-26 14:32:56.263408', '2021-02-26 14:32:56.263408', 10, 101);
INSERT INTO `base_sys_role_menu` VALUES (374, '2021-02-26 14:32:56.356537', '2021-02-26 14:32:56.356537', 10, 8);
INSERT INTO `base_sys_role_menu` VALUES (375, '2021-02-26 14:32:56.448195', '2021-02-26 14:32:56.448195', 10, 10);
INSERT INTO `base_sys_role_menu` VALUES (376, '2021-02-26 14:32:56.544394', '2021-02-26 14:32:56.544394', 10, 11);
INSERT INTO `base_sys_role_menu` VALUES (377, '2021-02-26 14:32:56.641515', '2021-02-26 14:32:56.641515', 10, 12);
INSERT INTO `base_sys_role_menu` VALUES (378, '2021-02-26 14:32:56.735242', '2021-02-26 14:32:56.735242', 10, 13);
INSERT INTO `base_sys_role_menu` VALUES (379, '2021-02-26 14:32:56.828811', '2021-02-26 14:32:56.828811', 10, 22);
INSERT INTO `base_sys_role_menu` VALUES (380, '2021-02-26 14:32:56.922664', '2021-02-26 14:32:56.922664', 10, 23);
INSERT INTO `base_sys_role_menu` VALUES (381, '2021-02-26 14:32:57.016873', '2021-02-26 14:32:57.016873', 10, 24);
INSERT INTO `base_sys_role_menu` VALUES (382, '2021-02-26 14:32:57.123800', '2021-02-26 14:32:57.123800', 10, 25);
INSERT INTO `base_sys_role_menu` VALUES (383, '2021-02-26 14:32:57.223306', '2021-02-26 14:32:57.223306', 10, 26);
INSERT INTO `base_sys_role_menu` VALUES (384, '2021-02-26 14:32:57.328482', '2021-02-26 14:32:57.328482', 10, 69);
INSERT INTO `base_sys_role_menu` VALUES (385, '2021-02-26 14:32:57.430006', '2021-02-26 14:32:57.430006', 10, 70);
INSERT INTO `base_sys_role_menu` VALUES (386, '2021-02-26 14:32:57.521664', '2021-02-26 14:32:57.521664', 10, 71);
INSERT INTO `base_sys_role_menu` VALUES (387, '2021-02-26 14:32:57.612399', '2021-02-26 14:32:57.612399', 10, 72);
INSERT INTO `base_sys_role_menu` VALUES (388, '2021-02-26 14:32:57.705553', '2021-02-26 14:32:57.705553', 10, 73);
INSERT INTO `base_sys_role_menu` VALUES (389, '2021-02-26 14:32:57.799288', '2021-02-26 14:32:57.799288', 10, 74);
INSERT INTO `base_sys_role_menu` VALUES (390, '2021-02-26 14:32:57.893894', '2021-02-26 14:32:57.893894', 10, 75);
INSERT INTO `base_sys_role_menu` VALUES (391, '2021-02-26 14:32:57.988856', '2021-02-26 14:32:57.988856', 10, 76);
INSERT INTO `base_sys_role_menu` VALUES (392, '2021-02-26 14:32:58.090250', '2021-02-26 14:32:58.090250', 10, 77);
INSERT INTO `base_sys_role_menu` VALUES (393, '2021-02-26 14:32:58.196616', '2021-02-26 14:32:58.196616', 10, 78);
INSERT INTO `base_sys_role_menu` VALUES (394, '2021-02-26 14:32:58.288151', '2021-02-26 14:32:58.288151', 10, 79);
INSERT INTO `base_sys_role_menu` VALUES (395, '2021-02-26 14:32:58.378493', '2021-02-26 14:32:58.378493', 10, 80);
INSERT INTO `base_sys_role_menu` VALUES (396, '2021-02-26 14:32:58.471283', '2021-02-26 14:32:58.471283', 10, 81);
INSERT INTO `base_sys_role_menu` VALUES (397, '2021-02-26 14:32:58.564666', '2021-02-26 14:32:58.564666', 10, 82);
INSERT INTO `base_sys_role_menu` VALUES (398, '2021-02-26 14:32:58.658511', '2021-02-26 14:32:58.658511', 10, 83);
INSERT INTO `base_sys_role_menu` VALUES (399, '2021-02-26 14:32:58.752713', '2021-02-26 14:32:58.752713', 10, 105);
INSERT INTO `base_sys_role_menu` VALUES (400, '2021-02-26 14:32:58.849472', '2021-02-26 14:32:58.849472', 10, 102);
INSERT INTO `base_sys_role_menu` VALUES (401, '2021-02-26 14:32:58.948387', '2021-02-26 14:32:58.948387', 10, 103);
INSERT INTO `base_sys_role_menu` VALUES (402, '2021-02-26 14:32:59.042410', '2021-02-26 14:32:59.042410', 10, 29);
INSERT INTO `base_sys_role_menu` VALUES (403, '2021-02-26 14:32:59.132594', '2021-02-26 14:32:59.132594', 10, 30);
INSERT INTO `base_sys_role_menu` VALUES (404, '2021-02-26 14:32:59.226150', '2021-02-26 14:32:59.226150', 10, 47);
INSERT INTO `base_sys_role_menu` VALUES (405, '2021-02-26 14:32:59.319494', '2021-02-26 14:32:59.319494', 10, 48);
INSERT INTO `base_sys_role_menu` VALUES (406, '2021-02-26 14:32:59.413370', '2021-02-26 14:32:59.413370', 10, 84);
INSERT INTO `base_sys_role_menu` VALUES (407, '2021-02-26 14:32:59.507584', '2021-02-26 14:32:59.507584', 10, 90);
INSERT INTO `base_sys_role_menu` VALUES (408, '2021-02-26 14:32:59.604332', '2021-02-26 14:32:59.604332', 10, 85);
INSERT INTO `base_sys_role_menu` VALUES (463, '2021-02-26 14:33:49.310315', '2021-02-26 14:33:49.310315', 13, 1);
INSERT INTO `base_sys_role_menu` VALUES (464, '2021-02-26 14:33:49.403445', '2021-02-26 14:33:49.403445', 13, 96);
INSERT INTO `base_sys_role_menu` VALUES (465, '2021-02-26 14:33:49.496802', '2021-02-26 14:33:49.496802', 13, 45);
INSERT INTO `base_sys_role_menu` VALUES (466, '2021-02-26 14:33:49.595210', '2021-02-26 14:33:49.595210', 13, 43);
INSERT INTO `base_sys_role_menu` VALUES (467, '2021-02-26 14:33:49.688024', '2021-02-26 14:33:49.688024', 13, 49);
INSERT INTO `base_sys_role_menu` VALUES (468, '2021-02-26 14:33:49.781292', '2021-02-26 14:33:49.781292', 13, 86);
INSERT INTO `base_sys_role_menu` VALUES (469, '2021-02-26 14:33:49.874061', '2021-02-26 14:33:49.874061', 13, 2);
INSERT INTO `base_sys_role_menu` VALUES (470, '2021-02-26 14:33:49.965534', '2021-02-26 14:33:49.965534', 13, 27);
INSERT INTO `base_sys_role_menu` VALUES (471, '2021-02-26 14:33:50.072373', '2021-02-26 14:33:50.072373', 13, 97);
INSERT INTO `base_sys_role_menu` VALUES (472, '2021-02-26 14:33:50.176473', '2021-02-26 14:33:50.176473', 13, 59);
INSERT INTO `base_sys_role_menu` VALUES (473, '2021-02-26 14:33:50.272264', '2021-02-26 14:33:50.272264', 13, 60);
INSERT INTO `base_sys_role_menu` VALUES (474, '2021-02-26 14:33:50.370328', '2021-02-26 14:33:50.370328', 13, 61);
INSERT INTO `base_sys_role_menu` VALUES (475, '2021-02-26 14:33:50.463159', '2021-02-26 14:33:50.463159', 13, 62);
INSERT INTO `base_sys_role_menu` VALUES (476, '2021-02-26 14:33:50.557911', '2021-02-26 14:33:50.557911', 13, 63);
INSERT INTO `base_sys_role_menu` VALUES (477, '2021-02-26 14:33:50.650669', '2021-02-26 14:33:50.650669', 13, 65);
INSERT INTO `base_sys_role_menu` VALUES (478, '2021-02-26 14:33:50.742871', '2021-02-26 14:33:50.742871', 13, 98);
INSERT INTO `base_sys_role_menu` VALUES (479, '2021-02-26 14:33:50.838052', '2021-02-26 14:33:50.838052', 13, 99);
INSERT INTO `base_sys_role_menu` VALUES (480, '2021-02-26 14:33:50.932201', '2021-02-26 14:33:50.932201', 13, 100);
INSERT INTO `base_sys_role_menu` VALUES (481, '2021-02-26 14:33:51.030973', '2021-02-26 14:33:51.030973', 13, 101);
INSERT INTO `base_sys_role_menu` VALUES (482, '2021-02-26 14:33:51.168873', '2021-02-26 14:33:51.168873', 13, 8);
INSERT INTO `base_sys_role_menu` VALUES (483, '2021-02-26 14:33:51.265779', '2021-02-26 14:33:51.265779', 13, 10);
INSERT INTO `base_sys_role_menu` VALUES (484, '2021-02-26 14:33:51.379934', '2021-02-26 14:33:51.379934', 13, 11);
INSERT INTO `base_sys_role_menu` VALUES (485, '2021-02-26 14:33:51.473016', '2021-02-26 14:33:51.473016', 13, 12);
INSERT INTO `base_sys_role_menu` VALUES (486, '2021-02-26 14:33:51.568753', '2021-02-26 14:33:51.568753', 13, 13);
INSERT INTO `base_sys_role_menu` VALUES (487, '2021-02-26 14:33:51.667262', '2021-02-26 14:33:51.667262', 13, 22);
INSERT INTO `base_sys_role_menu` VALUES (488, '2021-02-26 14:33:51.761865', '2021-02-26 14:33:51.761865', 13, 23);
INSERT INTO `base_sys_role_menu` VALUES (489, '2021-02-26 14:33:51.857295', '2021-02-26 14:33:51.857295', 13, 24);
INSERT INTO `base_sys_role_menu` VALUES (490, '2021-02-26 14:33:51.951231', '2021-02-26 14:33:51.951231', 13, 25);
INSERT INTO `base_sys_role_menu` VALUES (491, '2021-02-26 14:33:52.047431', '2021-02-26 14:33:52.047431', 13, 26);
INSERT INTO `base_sys_role_menu` VALUES (492, '2021-02-26 14:33:52.141210', '2021-02-26 14:33:52.141210', 13, 69);
INSERT INTO `base_sys_role_menu` VALUES (493, '2021-02-26 14:33:52.236892', '2021-02-26 14:33:52.236892', 13, 70);
INSERT INTO `base_sys_role_menu` VALUES (494, '2021-02-26 14:33:52.332986', '2021-02-26 14:33:52.332986', 13, 71);
INSERT INTO `base_sys_role_menu` VALUES (495, '2021-02-26 14:33:52.432629', '2021-02-26 14:33:52.432629', 13, 72);
INSERT INTO `base_sys_role_menu` VALUES (496, '2021-02-26 14:33:52.529105', '2021-02-26 14:33:52.529105', 13, 73);
INSERT INTO `base_sys_role_menu` VALUES (497, '2021-02-26 14:33:52.625291', '2021-02-26 14:33:52.625291', 13, 74);
INSERT INTO `base_sys_role_menu` VALUES (498, '2021-02-26 14:33:52.721109', '2021-02-26 14:33:52.721109', 13, 75);
INSERT INTO `base_sys_role_menu` VALUES (499, '2021-02-26 14:33:52.813753', '2021-02-26 14:33:52.813753', 13, 76);
INSERT INTO `base_sys_role_menu` VALUES (500, '2021-02-26 14:33:52.905436', '2021-02-26 14:33:52.905436', 13, 77);
INSERT INTO `base_sys_role_menu` VALUES (501, '2021-02-26 14:33:52.998499', '2021-02-26 14:33:52.998499', 13, 78);
INSERT INTO `base_sys_role_menu` VALUES (502, '2021-02-26 14:33:53.100975', '2021-02-26 14:33:53.100975', 13, 79);
INSERT INTO `base_sys_role_menu` VALUES (503, '2021-02-26 14:33:53.199493', '2021-02-26 14:33:53.199493', 13, 80);
INSERT INTO `base_sys_role_menu` VALUES (504, '2021-02-26 14:33:53.294088', '2021-02-26 14:33:53.294088', 13, 81);
INSERT INTO `base_sys_role_menu` VALUES (505, '2021-02-26 14:33:53.391390', '2021-02-26 14:33:53.391390', 13, 82);
INSERT INTO `base_sys_role_menu` VALUES (506, '2021-02-26 14:33:53.486104', '2021-02-26 14:33:53.486104', 13, 83);
INSERT INTO `base_sys_role_menu` VALUES (507, '2021-02-26 14:33:53.578385', '2021-02-26 14:33:53.578385', 13, 105);
INSERT INTO `base_sys_role_menu` VALUES (508, '2021-02-26 14:33:53.670073', '2021-02-26 14:33:53.670073', 13, 102);
INSERT INTO `base_sys_role_menu` VALUES (509, '2021-02-26 14:33:53.763868', '2021-02-26 14:33:53.763868', 13, 103);
INSERT INTO `base_sys_role_menu` VALUES (510, '2021-02-26 14:33:53.860706', '2021-02-26 14:33:53.860706', 13, 29);
INSERT INTO `base_sys_role_menu` VALUES (511, '2021-02-26 14:33:53.959262', '2021-02-26 14:33:53.959262', 13, 30);
INSERT INTO `base_sys_role_menu` VALUES (512, '2021-02-26 14:33:54.064932', '2021-02-26 14:33:54.064932', 13, 47);
INSERT INTO `base_sys_role_menu` VALUES (513, '2021-02-26 14:33:54.168918', '2021-02-26 14:33:54.168918', 13, 48);
INSERT INTO `base_sys_role_menu` VALUES (514, '2021-02-26 14:33:54.273982', '2021-02-26 14:33:54.273982', 13, 84);
INSERT INTO `base_sys_role_menu` VALUES (515, '2021-02-26 14:33:54.366992', '2021-02-26 14:33:54.366992', 13, 90);
INSERT INTO `base_sys_role_menu` VALUES (516, '2021-02-26 14:33:54.458682', '2021-02-26 14:33:54.458682', 13, 85);
COMMIT;

-- ----------------------------
-- Table structure for base_sys_user
-- ----------------------------
DROP TABLE IF EXISTS `base_sys_user`;
CREATE TABLE `base_sys_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `departmentId` bigint(20) DEFAULT NULL COMMENT '部门ID',
  `name` varchar(255) DEFAULT NULL COMMENT '姓名',
  `username` varchar(100) NOT NULL COMMENT '用户名',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `passwordV` int(11) NOT NULL DEFAULT '1' COMMENT '密码版本, 作用是改完密码，让原来的token失效',
  `nickName` varchar(255) DEFAULT NULL COMMENT '昵称',
  `headImg` varchar(255) DEFAULT NULL COMMENT '头像',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机',
  `email` varchar(255) DEFAULT NULL COMMENT '邮箱',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态 0:禁用 1：启用',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_469ad55973f5b98930f6ad627b` (`username`),
  KEY `IDX_0cf944da378d70a94f5fefd803` (`departmentId`),
  KEY `IDX_9ec6d7ac6337eafb070e4881a8` (`phone`),
  KEY `IDX_ca8611d15a63d52aa4e292e46a` (`createTime`),
  KEY `IDX_a0f2f19cee18445998ece93ddd` (`updateTime`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of base_sys_user
-- ----------------------------
BEGIN;
INSERT INTO `base_sys_user` VALUES (1, '2021-02-24 21:16:41.525157', '2021-02-27 18:21:16.000000', 1, '超级管理员', 'admin', 'e10adc3949ba59abbe56e057f20f883e', 3, '管理员', 'https://cool-admin-pro.oss-cn-shanghai.aliyuncs.com/app/c8128c24-d0e9-4e07-9c0d-6f65446e105b.png', '18000000000', 'team@cool-js.com', 1, '拥有最高权限的用户');
INSERT INTO `base_sys_user` VALUES (24, '2021-02-26 14:17:38.000000', '2021-02-26 14:17:38.000000', 11, '小白', 'xiaobai', 'e10adc3949ba59abbe56e057f20f883e', 1, '小白', NULL, NULL, NULL, 1, NULL);
INSERT INTO `base_sys_user` VALUES (25, '2021-02-26 14:28:25.000000', '2021-02-26 14:28:25.000000', 12, '小黑', 'xiaohei', 'e10adc3949ba59abbe56e057f20f883e', 1, '小黑', NULL, NULL, NULL, 1, NULL);
INSERT INTO `base_sys_user` VALUES (26, '2021-02-26 14:28:49.000000', '2021-02-26 14:28:49.000000', 12, '小绿', 'xiaolv', 'e10adc3949ba59abbe56e057f20f883e', 1, '小绿', NULL, NULL, NULL, 1, NULL);
INSERT INTO `base_sys_user` VALUES (27, '2021-02-26 14:29:23.000000', '2021-02-26 14:29:23.000000', 13, '小青', 'xiaoqin', 'e10adc3949ba59abbe56e057f20f883e', 1, '小青', NULL, NULL, NULL, 1, NULL);
INSERT INTO `base_sys_user` VALUES (28, '2021-02-26 14:29:52.000000', '2021-02-26 14:29:52.000000', 11, '神仙都没用', 'icssoa', 'e10adc3949ba59abbe56e057f20f883e', 1, '神仙都没用', 'https://cool-admin.cn.utools.club/uploads//20210226/0eeab9a0-77fc-11eb-b64f-674cd46b6601.jpg', NULL, NULL, 1, NULL);
COMMIT;

-- ----------------------------
-- Table structure for base_sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `base_sys_user_role`;
CREATE TABLE `base_sys_user_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `userId` bigint(20) NOT NULL COMMENT '用户ID',
  `roleId` bigint(20) NOT NULL COMMENT '角色ID',
  PRIMARY KEY (`id`),
  KEY `IDX_fa9555e03e42fce748c9046b1c` (`createTime`),
  KEY `IDX_3e36c0d2b1a4c659c6b4fc64b3` (`updateTime`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of base_sys_user_role
-- ----------------------------
BEGIN;
INSERT INTO `base_sys_user_role` VALUES (1, '2021-02-24 22:03:11.665805', '2021-02-24 22:03:11.665805', 1, 1);
INSERT INTO `base_sys_user_role` VALUES (2, '2021-02-25 11:03:55.325988', '2021-02-25 11:03:55.325988', 2, 1);
INSERT INTO `base_sys_user_role` VALUES (3, '2021-02-25 14:30:57.295150', '2021-02-25 14:30:57.295150', 3, 1);
INSERT INTO `base_sys_user_role` VALUES (4, '2021-02-25 14:39:32.975014', '2021-02-25 14:39:32.975014', 4, 1);
INSERT INTO `base_sys_user_role` VALUES (5, '2021-02-25 14:40:56.812948', '2021-02-25 14:40:56.812948', 5, 1);
INSERT INTO `base_sys_user_role` VALUES (6, '2021-02-25 14:44:08.436555', '2021-02-25 14:44:08.436555', 6, 1);
INSERT INTO `base_sys_user_role` VALUES (7, '2021-02-25 14:46:17.409232', '2021-02-25 14:46:17.409232', 7, 1);
INSERT INTO `base_sys_user_role` VALUES (8, '2021-02-25 14:47:47.211749', '2021-02-25 14:47:47.211749', 8, 1);
INSERT INTO `base_sys_user_role` VALUES (9, '2021-02-25 14:48:11.734024', '2021-02-25 14:48:11.734024', 9, 1);
INSERT INTO `base_sys_user_role` VALUES (10, '2021-02-25 14:50:48.288616', '2021-02-25 14:50:48.288616', 10, 1);
INSERT INTO `base_sys_user_role` VALUES (11, '2021-02-25 14:51:32.123884', '2021-02-25 14:51:32.123884', 11, 1);
INSERT INTO `base_sys_user_role` VALUES (12, '2021-02-25 15:46:26.356943', '2021-02-25 15:46:26.356943', 12, 1);
INSERT INTO `base_sys_user_role` VALUES (13, '2021-02-25 15:56:43.475155', '2021-02-25 15:56:43.475155', 13, 1);
INSERT INTO `base_sys_user_role` VALUES (14, '2021-02-25 16:03:14.417784', '2021-02-25 16:03:14.417784', 14, 1);
INSERT INTO `base_sys_user_role` VALUES (16, '2021-02-25 16:22:11.200152', '2021-02-25 16:22:11.200152', 16, 1);
INSERT INTO `base_sys_user_role` VALUES (17, '2021-02-25 17:44:37.635550', '2021-02-25 17:44:37.635550', 15, 1);
INSERT INTO `base_sys_user_role` VALUES (19, '2021-02-25 17:51:00.554812', '2021-02-25 17:51:00.554812', 18, 1);
INSERT INTO `base_sys_user_role` VALUES (21, '2021-02-25 17:54:41.375113', '2021-02-25 17:54:41.375113', 17, 1);
INSERT INTO `base_sys_user_role` VALUES (22, '2021-02-25 17:55:49.385301', '2021-02-25 17:55:49.385301', 20, 1);
INSERT INTO `base_sys_user_role` VALUES (24, '2021-02-25 17:58:35.452363', '2021-02-25 17:58:35.452363', 22, 1);
INSERT INTO `base_sys_user_role` VALUES (27, '2021-02-25 21:25:55.005236', '2021-02-25 21:25:55.005236', 19, 1);
INSERT INTO `base_sys_user_role` VALUES (28, '2021-02-26 13:50:05.633242', '2021-02-26 13:50:05.633242', 21, 8);
INSERT INTO `base_sys_user_role` VALUES (29, '2021-02-26 13:50:17.836990', '2021-02-26 13:50:17.836990', 23, 8);
INSERT INTO `base_sys_user_role` VALUES (38, '2021-02-26 14:36:08.899046', '2021-02-26 14:36:08.899046', 26, 13);
INSERT INTO `base_sys_user_role` VALUES (39, '2021-02-26 14:36:13.149510', '2021-02-26 14:36:13.149510', 25, 13);
INSERT INTO `base_sys_user_role` VALUES (40, '2021-02-26 14:36:20.737073', '2021-02-26 14:36:20.737073', 27, 11);
INSERT INTO `base_sys_user_role` VALUES (42, '2021-02-26 14:36:53.481478', '2021-02-26 14:36:53.481478', 24, 12);
INSERT INTO `base_sys_user_role` VALUES (43, '2021-02-26 14:36:58.477817', '2021-02-26 14:36:58.477817', 28, 12);
INSERT INTO `base_sys_user_role` VALUES (44, '2021-02-26 14:36:58.577114', '2021-02-26 14:36:58.577114', 28, 10);
COMMIT;

-- ----------------------------
-- Table structure for core_config
-- ----------------------------
DROP TABLE IF EXISTS `core_config`;
CREATE TABLE `core_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `cKey` varchar(255) NOT NULL COMMENT '配置键 唯一性',
  `cValue` text NOT NULL COMMENT '配置值',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_fd61f44f8fc57eaf4694a4fd56` (`cKey`),
  KEY `IDX_bd838f3b2d5bfa596c57412646` (`createTime`),
  KEY `IDX_ad74623a3e9a43335eac8d1154` (`updateTime`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of core_config
-- ----------------------------
BEGIN;
INSERT INTO `core_config` VALUES (1, '2021-02-26 17:58:21.201000', '2021-02-27 13:33:27.671000', 'oss.accessKeyId', '');
INSERT INTO `core_config` VALUES (2, '2021-02-26 17:58:48.970000', '2021-02-27 11:49:59.205000', 'oss.accessKeySecret', '');
INSERT INTO `core_config` VALUES (3, '2021-02-26 17:59:09.894000', '2021-02-27 11:50:00.921000', 'oss.bucket', '');
INSERT INTO `core_config` VALUES (4, '2021-02-26 17:59:25.566000', '2021-02-27 11:50:03.167000', 'oss.endpoint', '');
INSERT INTO `core_config` VALUES (5, '2021-02-26 18:00:06.396000', '2021-02-27 13:32:58.068000', 'oss.timeout', '3600s');
INSERT INTO `core_config` VALUES (6, '2021-03-02 17:19:51.730160', '2021-03-02 17:19:51.730160', 'cool.core.init.db', 'init');
INSERT INTO `core_config` VALUES (10, '2021-03-03 17:22:50.757000', '2021-03-03 17:22:50.757000', 'redis.redis', '{\n    \"host\": \"127.0.0.1\",\n    \"password\": \"\",\n    \"port\": 6379,\n    \"db\": 2\n}');
COMMIT;

-- ----------------------------
-- Table structure for core_plugin
-- ----------------------------
DROP TABLE IF EXISTS `core_plugin`;
CREATE TABLE `core_plugin` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `author` varchar(255) NOT NULL COMMENT '作者',
  `contact` varchar(255) NOT NULL COMMENT '联系方式',
  `description` text NOT NULL COMMENT '功能描述',
  `version` varchar(255) NOT NULL COMMENT '版本号',
  `enable` tinyint(4) NOT NULL DEFAULT '1' COMMENT '是否启用 0：否 1：是',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '状态 0:缺少配置 1:可用 2: 配置错误 3:未知错误',
  `namespace` varchar(255) NOT NULL COMMENT '命名空间',
  `view` text COMMENT '页面信息',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_eecfe4f7cae1c102745ffccb9d` (`name`),
  KEY `IDX_851967f56db40707b8a55914d7` (`createTime`),
  KEY `IDX_b9880bb45d647eba03fc3052c4` (`updateTime`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of core_plugin
-- ----------------------------
BEGIN;
INSERT INTO `core_plugin` VALUES (8, '2021-03-03 11:26:59.822415', '2021-03-04 18:40:31.000000', 'Redis缓存', 'cool官方', '邮箱：team@cool-js.com', '替换系统的默认缓存为redis', '1.0.0', 1, 1, 'redis', '[{\n    \"label\": \"配置\",\n    \"prop\": \"redis\",\n    \"component\": {\n        \"name\": \"cl-codemirror\",\n        \"attrs\": {\n            \"placeholder\": \"{\\\"host\\\":\\\"127.0.0.1\\\",\\\"password\\\":\\\"\\\",\\\"port\\\":6379,\\\"db\\\":2}\"\n        },\n        \"props\":{\n            \"height\": \"200px\"\n        }\n    },\n    \"value\": \"{\\\"host\\\":\\\"127.0.0.1\\\",\\\"password\\\":\\\"\\\",\\\"port\\\":6379,\\\"db\\\":2}\",\n    \"props\": {\n        \"label-width\": \"80px\"\n    },\n    \"rules\": {\n        \"required\": true,\n        \"message\": \"值不能为空\"\n    }\n}]');
INSERT INTO `core_plugin` VALUES (9, '2021-03-03 16:25:14.668900', '2021-03-04 18:40:31.000000', '阿里云OSS', 'cool官方', '邮箱：team@cool-js.com', '将文件上传到阿里云oss，前端签名直传方式', '1.0.0', 1, 0, 'oss', NULL);
INSERT INTO `core_plugin` VALUES (14, '2021-03-04 16:28:00.891291', '2021-03-04 18:40:31.000000', '任务与队列', 'cool官方', '邮箱：team@cool-js.com', '替换系统的默认缓存为redis', '1.0.0', 1, 1, 'queue', NULL);
COMMIT;

-- ----------------------------
-- Table structure for demo_app_goods
-- ----------------------------
DROP TABLE IF EXISTS `demo_app_goods`;
CREATE TABLE `demo_app_goods` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `title` varchar(255) NOT NULL COMMENT '标题',
  `pic` varchar(255) NOT NULL COMMENT '图片',
  `price` decimal(5,2) NOT NULL COMMENT '价格',
  PRIMARY KEY (`id`),
  KEY `IDX_de2b99b64158bb4030487d7475` (`createTime`),
  KEY `IDX_f84cff6dc28b1a5dcc53856e66` (`updateTime`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of demo_app_goods
-- ----------------------------
BEGIN;
INSERT INTO `demo_app_goods` VALUES (1, '2021-03-02 17:22:10.687462', '2021-03-02 17:22:10.687462', 'cool-mall商城', 'https://docs.cool-js.com/mall/show05.jpeg', 20.00);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
