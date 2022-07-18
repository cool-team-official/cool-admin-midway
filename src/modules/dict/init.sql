BEGIN;
INSERT INTO `base_sys_menu` VALUES (197, '2022-07-05 16:05:27.403000', '2022-07-05 16:15:16.025000', NULL, '字典管理', NULL, NULL, 0, 'icon-log', 3, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (198, '2022-07-05 16:08:50.307000', '2022-07-05 16:14:13.196000', 197, '字典列表', '/dict/list', NULL, 1, 'icon-menu', 1, 'modules/dict/views/list.vue', 1, 1);
INSERT INTO `base_sys_menu` VALUES (199, '2022-07-05 16:08:50.748162', '2022-07-05 16:08:50.748162', 198, '删除', NULL, 'dict:info:delete', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (200, '2022-07-05 16:08:50.800623', '2022-07-05 16:08:50.800623', 198, '修改', NULL, 'dict:info:update,dict:info:info', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (201, '2022-07-05 16:08:50.859141', '2022-07-05 16:08:50.859141', 198, '获得字典数据', NULL, 'dict:info:data', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (202, '2022-07-05 16:08:50.916874', '2022-07-05 16:08:50.916874', 198, '单个信息', NULL, 'dict:info:info', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (203, '2022-07-05 16:08:50.972783', '2022-07-05 16:08:50.972783', 198, '列表查询', NULL, 'dict:info:list', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (204, '2022-07-05 16:08:51.030928', '2022-07-05 16:08:51.030928', 198, '分页查询', NULL, 'dict:info:page', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (205, '2022-07-05 16:08:51.087883', '2022-07-05 16:08:51.087883', 198, '新增', NULL, 'dict:info:add', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (206, '2022-07-06 10:41:26.503000', '2022-07-06 10:41:37.000000', 198, '组权限', NULL, 'dict:type:list,dict:type:update,dict:type:delete,dict:type:add', 2, NULL, 0, NULL, 1, 1);
COMMIT;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dict_info
-- ----------------------------
DROP TABLE IF EXISTS `dict_info`;
CREATE TABLE `dict_info` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `typeId` int NOT NULL COMMENT '类型ID',
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL COMMENT '名称',
  `orderNum` int NOT NULL DEFAULT '0' COMMENT '排序',
  `remark` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '备注',
  `parentId` int COMMENT '父ID',
  PRIMARY KEY (`id`),
  KEY `IDX_5c311a4af30de1181a5d7a7cc2` (`createTime`),
  KEY `IDX_10362a62adbf120821fff209d8` (`updateTime`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of dict_info
-- ----------------------------
BEGIN;
INSERT INTO `dict_info` VALUES (1, '2022-07-06 14:18:53.841000', '2022-07-06 14:19:10.954000', 1, '衣服', 2, NULL, NULL);
INSERT INTO `dict_info` VALUES (2, '2022-07-06 14:18:59.834000', '2022-07-06 14:18:59.834000', 1, '裤子', 1, NULL, NULL);
INSERT INTO `dict_info` VALUES (3, '2022-07-06 14:19:03.993000', '2022-07-06 14:19:15.251000', 1, '鞋子', 3, NULL, NULL);
INSERT INTO `dict_info` VALUES (4, '2022-07-06 14:21:47.122000', '2022-07-06 14:22:26.131000', 2, '闪酷', 2, NULL, NULL);
INSERT INTO `dict_info` VALUES (5, '2022-07-06 14:22:18.309000', '2022-07-06 14:22:18.309000', 2, 'COOL', 1, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for dict_type
-- ----------------------------
DROP TABLE IF EXISTS `dict_type`;
CREATE TABLE `dict_type` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL COMMENT '名称',
  `key` varchar(255) COLLATE utf8mb4_general_ci NOT NULL COMMENT '标识',
  PRIMARY KEY (`id`),
  KEY `IDX_69734e5c2d29cc2139d5078f2c` (`createTime`),
  KEY `IDX_6cccb2e33846cd354e8dc0e0ef` (`updateTime`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of dict_type
-- ----------------------------
BEGIN;
INSERT INTO `dict_type` VALUES (1, '2022-07-06 14:18:41.879000', '2022-07-06 14:18:41.879000', '类别', 'type');
INSERT INTO `dict_type` VALUES (2, '2022-07-06 14:21:33.778000', '2022-07-06 14:21:33.778000', '品牌', 'brand');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;