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

 Date: 05/03/2021 16:41:26
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;


-- ----------------------------
-- Table structure for task_info
-- ----------------------------
DROP TABLE IF EXISTS `task_info`;
CREATE TABLE `task_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `repeatConf` varchar(1000) DEFAULT NULL COMMENT '任务配置',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `cron` varchar(255) DEFAULT NULL COMMENT 'cron',
  `limitCount` int(11) DEFAULT NULL COMMENT '最大执行次数 不传为无限次',
  `every` int(11) DEFAULT NULL COMMENT '每间隔多少毫秒执行一次 如果cron设置了 这项设置就无效',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态 0:停止 1：运行',
  `startDate` datetime DEFAULT NULL COMMENT '开始时间',
  `endDate` datetime DEFAULT NULL COMMENT '结束时间',
  `data` varchar(255) DEFAULT NULL COMMENT '数据',
  `service` varchar(255) DEFAULT NULL COMMENT '执行的service实例ID',
  `type` tinyint(4) NOT NULL DEFAULT '0' COMMENT '状态 0:系统 1：用户',
  `nextRunTime` datetime DEFAULT NULL COMMENT '下一次执行时间',
  `taskType` tinyint(4) NOT NULL DEFAULT '0' COMMENT '状态 0:cron 1：时间间隔',
  `jobId` varchar(255) DEFAULT NULL COMMENT '任务ID',
  PRIMARY KEY (`id`),
  KEY `IDX_6ced02f467e59bd6306b549bb0` (`createTime`),
  KEY `IDX_2adc6f9c241391126f27dac145` (`updateTime`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of task_info
-- ----------------------------
BEGIN;
INSERT INTO `task_info` VALUES (1, '2021-03-05 11:46:24.000000', '2021-03-05 16:33:44.081230', '{\"count\":1,\"id\":1,\"createTime\":\"2021-03-05 11:46:24\",\"updateTime\":\"2021-03-05 16:33:37\",\"jobId\":1,\"name\":\"测试\",\"every\":1000,\"status\":1,\"service\":\"demoOrderService.test()\",\"type\":\"0\",\"taskType\":1}', '测试', NULL, NULL, 1000, NULL, 0, NULL, NULL, NULL, 'demoOrderService.test()', 0, NULL, 1, 'repeat:73bac7c57dd4c1ffd6dc41c3c3cb40e1:1614932670000');
COMMIT;

-- ----------------------------
-- Table structure for task_log
-- ----------------------------
DROP TABLE IF EXISTS `task_log`;
CREATE TABLE `task_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `taskId` bigint(20) DEFAULT NULL COMMENT '任务ID',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '状态 0:失败 1：成功',
  `detail` text COMMENT '详情描述',
  PRIMARY KEY (`id`),
  KEY `IDX_b9af0e100be034924b270aab31` (`createTime`),
  KEY `IDX_8857d8d43d38bebd7159af1fa6` (`updateTime`),
  KEY `IDX_1142dfec452e924b346f060fda` (`taskId`)
) ENGINE=InnoDB AUTO_INCREMENT=541 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of task_log
-- ----------------------------
BEGIN;
INSERT INTO `task_log` VALUES (521, '2021-03-05 16:32:09.017824', '2021-03-05 16:32:09.017824', 1, 1, '');
INSERT INTO `task_log` VALUES (522, '2021-03-05 16:32:10.015478', '2021-03-05 16:32:10.015478', 1, 1, '');
INSERT INTO `task_log` VALUES (523, '2021-03-05 16:32:11.017549', '2021-03-05 16:32:11.017549', 1, 1, '');
INSERT INTO `task_log` VALUES (524, '2021-03-05 16:32:12.015647', '2021-03-05 16:32:12.015647', 1, 1, '');
INSERT INTO `task_log` VALUES (525, '2021-03-05 16:32:35.349964', '2021-03-05 16:32:35.349964', 1, 1, '');
INSERT INTO `task_log` VALUES (526, '2021-03-05 16:33:22.020797', '2021-03-05 16:33:22.020797', 1, 1, '');
INSERT INTO `task_log` VALUES (527, '2021-03-05 16:33:23.015415', '2021-03-05 16:33:23.015415', 1, 1, '');
INSERT INTO `task_log` VALUES (528, '2021-03-05 16:33:24.013962', '2021-03-05 16:33:24.013962', 1, 1, '');
INSERT INTO `task_log` VALUES (529, '2021-03-05 16:33:29.017289', '2021-03-05 16:33:29.017289', 1, 1, '');
INSERT INTO `task_log` VALUES (530, '2021-03-05 16:33:30.014388', '2021-03-05 16:33:30.014388', 1, 1, '');
INSERT INTO `task_log` VALUES (531, '2021-03-05 16:33:31.019317', '2021-03-05 16:33:31.019317', 1, 1, '');
INSERT INTO `task_log` VALUES (532, '2021-03-05 16:33:32.016401', '2021-03-05 16:33:32.016401', 1, 1, '');
INSERT INTO `task_log` VALUES (533, '2021-03-05 16:33:33.014518', '2021-03-05 16:33:33.014518', 1, 1, '');
INSERT INTO `task_log` VALUES (534, '2021-03-05 16:33:38.019010', '2021-03-05 16:33:38.019010', 1, 1, '');
INSERT INTO `task_log` VALUES (535, '2021-03-05 16:33:39.015834', '2021-03-05 16:33:39.015834', 1, 1, '');
INSERT INTO `task_log` VALUES (536, '2021-03-05 16:33:40.015489', '2021-03-05 16:33:40.015489', 1, 1, '');
INSERT INTO `task_log` VALUES (537, '2021-03-05 16:33:41.013458', '2021-03-05 16:33:41.013458', 1, 1, '');
INSERT INTO `task_log` VALUES (538, '2021-03-05 16:33:42.015814', '2021-03-05 16:33:42.015814', 1, 1, '');
INSERT INTO `task_log` VALUES (539, '2021-03-05 16:33:43.014712', '2021-03-05 16:33:43.014712', 1, 1, '');
INSERT INTO `task_log` VALUES (540, '2021-03-05 16:33:44.014487', '2021-03-05 16:33:44.014487', 1, 1, '');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;