
-- ----------------------------
-- Table structure for base_sys_conf
-- ----------------------------
DROP TABLE IF EXISTS `base_sys_conf`;
CREATE TABLE `base_sys_conf` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `cKey` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '配置键',
  `cValue` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '配置值',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `IDX_9be195d27767b4485417869c3a` (`cKey`) USING BTREE,
  KEY `IDX_905208f206a3ff9fd513421971` (`createTime`) USING BTREE,
  KEY `IDX_4c6f27f6ecefe51a5a196a047a` (`updateTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '部门名称',
  `parentId` bigint DEFAULT NULL COMMENT '上级部门ID',
  `orderNum` int NOT NULL DEFAULT '0' COMMENT '排序',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `IDX_be4c53cd671384fa588ca9470a` (`createTime`) USING BTREE,
  KEY `IDX_ca1473a793961ec55bc0c8d268` (`updateTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of base_sys_department
-- ----------------------------
BEGIN;
INSERT INTO `base_sys_department` VALUES (1, '2021-02-24 21:17:11.971397', '2023-03-07 00:39:53.000000', 'COOL', NULL, 0);
INSERT INTO `base_sys_department` VALUES (11, '2021-02-26 14:17:06.690613', '2023-03-07 00:39:53.000000', '开发', 12, 2);
INSERT INTO `base_sys_department` VALUES (12, '2021-02-26 14:17:11.576369', '2023-03-07 00:39:53.000000', '测试', 1, 1);
INSERT INTO `base_sys_department` VALUES (13, '2021-02-26 14:28:59.685177', '2023-03-07 00:39:53.000000', '游客', 1, 3);
COMMIT;

-- ----------------------------
-- Table structure for base_sys_log
-- ----------------------------
DROP TABLE IF EXISTS `base_sys_log`;
CREATE TABLE `base_sys_log` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `userId` bigint DEFAULT NULL COMMENT '用户ID',
  `ipAddr` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'ip地址',
  `params` json DEFAULT NULL COMMENT '参数',
  `action` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '行为',
  `ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'ip',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `IDX_51a2caeb5713efdfcb343a8772` (`userId`) USING BTREE,
  KEY `IDX_a03a27f75cf8d502b3060823e1` (`ipAddr`) USING BTREE,
  KEY `IDX_c9382b76219a1011f7b8e7bcd1` (`createTime`) USING BTREE,
  KEY `IDX_bfd44e885b470da43bcc39aaa7` (`updateTime`) USING BTREE,
  KEY `IDX_938f886fb40e163db174b7f6c3` (`action`) USING BTREE,
  KEY `IDX_24e18767659f8c7142580893f2` (`ip`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for base_sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `base_sys_menu`;
CREATE TABLE `base_sys_menu` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `parentId` bigint DEFAULT NULL COMMENT '父菜单ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '菜单名称',
  `router` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '菜单地址',
  `perms` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '权限标识',
  `type` tinyint NOT NULL DEFAULT '0' COMMENT '类型 0-目录 1-菜单 2-按钮',
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '图标',
  `orderNum` int NOT NULL DEFAULT '0' COMMENT '排序',
  `viewPath` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '视图地址',
  `keepAlive` tinyint NOT NULL DEFAULT '1' COMMENT '路由缓存',
  `isShow` tinyint NOT NULL DEFAULT '1' COMMENT '是否显示',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `IDX_05e3d6a56604771a6da47ebf8e` (`createTime`) USING BTREE,
  KEY `IDX_d5203f18daaf7c3fe0ab34497f` (`updateTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=453 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of base_sys_menu
-- ----------------------------
BEGIN;
INSERT INTO `base_sys_menu` VALUES (2, '2019-09-11 11:14:47.000000', '2023-09-11 14:53:40.149000', NULL, '系统管理', '/sys', NULL, 0, 'icon-system', 2, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (8, '1900-01-20 23:19:57.000000', '2023-09-13 18:12:57.980000', 27, '菜单列表', '/sys/menu', NULL, 1, 'icon-menu', 2, 'modules/base/views/menu/index.vue', 1, 1);
INSERT INTO `base_sys_menu` VALUES (10, '1900-01-20 00:19:27.325000', '1900-01-20 00:19:27.325000', 8, '新增', NULL, 'base:sys:menu:add', 2, NULL, 1, NULL, 0, 1);
INSERT INTO `base_sys_menu` VALUES (11, '1900-01-20 00:19:51.101000', '1900-01-20 00:19:51.101000', 8, '删除', NULL, 'base:sys:menu:delete', 2, NULL, 2, NULL, 0, 1);
INSERT INTO `base_sys_menu` VALUES (13, '1900-01-20 00:20:19.341000', '1900-01-20 00:20:19.341000', 8, '查询', NULL, 'base:sys:menu:page,base:sys:menu:list,base:sys:menu:info', 2, NULL, 4, NULL, 0, 1);
INSERT INTO `base_sys_menu` VALUES (22, '2019-09-12 00:34:01.000000', '2023-02-17 16:14:37.299000', 27, '角色列表', '/sys/role', NULL, 1, 'icon-dept', 3, 'cool/modules/base/views/role.vue', 1, 1);
INSERT INTO `base_sys_menu` VALUES (23, '1900-01-20 00:34:23.459000', '1900-01-20 00:34:23.459000', 22, '新增', NULL, 'base:sys:role:add', 2, NULL, 1, NULL, 0, 1);
INSERT INTO `base_sys_menu` VALUES (24, '1900-01-20 00:34:40.523000', '1900-01-20 00:34:40.523000', 22, '删除', NULL, 'base:sys:role:delete', 2, NULL, 2, NULL, 0, 1);
INSERT INTO `base_sys_menu` VALUES (25, '1900-01-20 00:34:53.306000', '1900-01-20 00:34:53.306000', 22, '修改', NULL, 'base:sys:role:update', 2, NULL, 3, NULL, 0, 1);
INSERT INTO `base_sys_menu` VALUES (26, '1900-01-20 00:35:05.024000', '1900-01-20 00:35:05.024000', 22, '查询', NULL, 'base:sys:role:page,base:sys:role:list,base:sys:role:info', 2, NULL, 4, NULL, 0, 1);
INSERT INTO `base_sys_menu` VALUES (27, '2019-09-12 15:52:44.000000', '2023-09-11 14:52:08.845000', 2, '权限管理', NULL, NULL, 0, 'icon-auth', 1, NULL, 0, 1);
INSERT INTO `base_sys_menu` VALUES (29, '2019-09-12 17:35:51.000000', '2021-03-08 23:01:39.000000', 105, '请求日志', '/sys/log', NULL, 1, 'icon-log', 1, 'cool/modules/base/views/log.vue', 1, 1);
INSERT INTO `base_sys_menu` VALUES (30, '2019-09-12 17:37:03.000000', '2021-03-03 10:16:26.000000', 29, '权限', NULL, 'base:sys:log:page,base:sys:log:clear,base:sys:log:getKeep,base:sys:log:setKeep', 2, NULL, 1, NULL, 0, 1);
INSERT INTO `base_sys_menu` VALUES (47, '2019-11-08 09:35:08.000000', '2023-09-20 18:28:26.532000', NULL, '框架教程', '/tutorial', NULL, 0, 'icon-task', 98, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (48, '2019-11-08 09:35:53.000000', '2021-03-03 11:03:21.000000', 47, '文档', '/tutorial/doc', NULL, 1, 'icon-log', 0, 'https://admin.cool-js.com', 1, 1);
INSERT INTO `base_sys_menu` VALUES (59, '2019-11-18 16:50:27.000000', '2019-11-18 16:50:27.000000', 97, '部门列表', NULL, 'base:sys:department:list', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (60, '2019-11-18 16:50:45.000000', '2019-11-18 16:50:45.000000', 97, '新增部门', NULL, 'base:sys:department:add', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (61, '2019-11-18 16:50:59.000000', '2019-11-18 16:50:59.000000', 97, '更新部门', NULL, 'base:sys:department:update', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (62, '2019-11-18 16:51:13.000000', '2019-11-18 16:51:13.000000', 97, '删除部门', NULL, 'base:sys:department:delete', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (63, '2019-11-18 17:49:35.000000', '2019-11-18 17:49:35.000000', 97, '部门排序', NULL, 'base:sys:department:order', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (65, '2019-11-18 23:59:21.000000', '2019-11-18 23:59:21.000000', 97, '用户转移', NULL, 'base:sys:user:move', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (78, '2019-12-10 13:27:56.000000', '2023-02-17 16:05:06.071000', 2, '参数配置', NULL, NULL, 0, 'icon-params', 3, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (79, '1900-01-20 13:29:33.000000', '2021-03-08 23:01:48.000000', 78, '参数列表', '/sys/param', NULL, 1, 'icon-menu', 0, 'cool/modules/base/views/param.vue', 1, 1);
INSERT INTO `base_sys_menu` VALUES (80, '1900-01-20 13:29:50.146000', '1900-01-20 13:29:50.146000', 79, '新增', NULL, 'base:sys:param:add', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (81, '1900-01-20 13:30:10.030000', '1900-01-20 13:30:10.030000', 79, '修改', NULL, 'base:sys:param:info,base:sys:param:update', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (82, '1900-01-20 13:30:25.791000', '1900-01-20 13:30:25.791000', 79, '删除', NULL, 'base:sys:param:delete', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (83, '1900-01-20 13:30:40.469000', '1900-01-20 13:30:40.469000', 79, '查看', NULL, 'base:sys:param:page,base:sys:param:list,base:sys:param:info', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (84, '2020-07-25 16:21:30.000000', '2023-09-28 16:36:33.673000', NULL, '通用', NULL, NULL, 0, 'icon-radioboxfill', 99, NULL, 1, 0);
INSERT INTO `base_sys_menu` VALUES (85, '2020-07-25 16:22:14.000000', '2021-03-03 10:36:00.000000', 84, '图片上传', NULL, 'space:info:page,space:info:list,space:info:info,space:info:add,space:info:delete,space:info:update,space:type:page,space:type:list,space:type:info,space:type:add,space:type:delete,space:type:update', 2, NULL, 1, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (97, '1900-01-20 14:14:02.000000', '2023-02-28 15:51:30.854000', 27, '用户列表', '/sys/user', NULL, 1, 'icon-user', 0, 'modules/base/views/user/index.vue', 1, 1);
INSERT INTO `base_sys_menu` VALUES (98, '1900-01-20 14:14:13.528000', '1900-01-20 14:14:13.528000', 97, '新增', NULL, 'base:sys:user:add', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (99, '1900-01-20 14:14:22.823000', '1900-01-20 14:14:22.823000', 97, '删除', NULL, 'base:sys:user:delete', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (100, '1900-01-20 14:14:33.973000', '1900-01-20 14:14:33.973000', 97, '修改', NULL, 'base:sys:user:delete,base:sys:user:update', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (101, '2021-01-12 14:14:51.000000', '2021-01-12 14:14:51.000000', 97, '查询', NULL, 'base:sys:user:page,base:sys:user:list,base:sys:user:info', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (105, '2021-01-21 10:42:55.000000', '2023-02-17 16:05:19.312000', 2, '监控管理', NULL, NULL, 0, 'icon-monitor', 9, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (117, '2021-03-05 10:58:25.000000', '2023-09-20 17:20:02.224000', NULL, '任务管理', NULL, NULL, 0, 'icon-activity', 97, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (118, '2021-03-05 10:59:42.000000', '2023-02-14 14:05:48.454000', 117, '任务列表', '/task/list', NULL, 1, 'icon-menu', 0, 'modules/task/views/list.vue', 1, 1);
INSERT INTO `base_sys_menu` VALUES (119, '2021-03-05 11:00:00.000000', '2021-03-05 11:00:00.000000', 118, '权限', NULL, 'task:info:page,task:info:list,task:info:info,task:info:add,task:info:delete,task:info:update,task:info:stop,task:info:start,task:info:once,task:info:log', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (197, '2022-07-05 16:05:27.403000', '2023-09-11 14:50:59.077000', NULL, '字典管理', NULL, NULL, 0, 'icon-dict', 3, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (198, '2022-07-05 16:08:50.307000', '2023-09-11 12:28:11.350000', 197, '字典列表', '/dict/list', NULL, 1, 'icon-menu', 1, 'modules/dict/views/list.vue', 1, 1);
INSERT INTO `base_sys_menu` VALUES (199, '2022-07-05 16:08:50.748162', '2022-07-05 16:08:50.748162', 198, '删除', NULL, 'dict:info:delete', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (200, '2022-07-05 16:08:50.800623', '2022-07-05 16:08:50.800623', 198, '修改', NULL, 'dict:info:update,dict:info:info', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (201, '2022-07-05 16:08:50.859141', '2022-07-05 16:08:50.859141', 198, '获得字典数据', NULL, 'dict:info:data', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (202, '2022-07-05 16:08:50.916874', '2022-07-05 16:08:50.916874', 198, '单个信息', NULL, 'dict:info:info', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (203, '2022-07-05 16:08:50.972783', '2022-07-05 16:08:50.972783', 198, '列表查询', NULL, 'dict:info:list', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (204, '2022-07-05 16:08:51.030928', '2022-07-05 16:08:51.030928', 198, '分页查询', NULL, 'dict:info:page', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (205, '2022-07-05 16:08:51.087883', '2022-07-05 16:08:51.087883', 198, '新增', NULL, 'dict:info:add', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (206, '2022-07-06 10:41:26.503000', '2022-07-06 10:41:37.000000', 198, '组权限', NULL, 'dict:type:list,dict:type:update,dict:type:delete,dict:type:add', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (228, '2023-02-13 14:57:10.974000', '2023-09-11 14:58:58.839000', NULL, '数据管理', NULL, NULL, 0, 'icon-data', 3, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (229, '2023-02-13 14:57:47.855000', '2023-02-17 16:04:57.051000', 228, '数据回收站', '/recycle/data', NULL, 1, 'icon-delete', 1, 'modules/recycle/views/data.vue', 1, 1);
INSERT INTO `base_sys_menu` VALUES (230, '2023-02-13 14:57:48.293292', '2023-02-13 14:57:48.293292', 229, '恢复数据', NULL, 'recycle:data:restore', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (231, '2023-02-13 14:57:48.293292', '2023-02-13 14:57:48.293292', 229, '单个信息', NULL, 'recycle:data:info', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (232, '2023-02-13 14:57:48.293292', '2023-02-13 14:57:48.293292', 229, '分页查询', NULL, 'recycle:data:page', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (233, '2023-02-13 19:29:49.240000', '2023-09-20 17:19:56.797000', NULL, '物联管理', NULL, NULL, 0, 'icon-iot', 4, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (234, '2023-02-13 19:31:31.890000', '2023-09-20 17:19:58.437000', 233, 'MQTT', '/iot/device', NULL, 1, 'icon-device', 1, 'modules/iot/views/device.vue', 1, 1);
INSERT INTO `base_sys_menu` VALUES (235, '2023-02-13 19:32:58.637593', '2023-02-13 19:32:58.637593', 234, '删除', NULL, 'iot:device:delete', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (236, '2023-02-13 19:32:58.637593', '2023-02-13 19:32:58.637593', 234, '单个信息', NULL, 'iot:device:info', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (237, '2023-02-13 19:32:58.637593', '2023-02-13 19:32:58.637593', 234, '列表查询', NULL, 'iot:device:list', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (238, '2023-02-13 19:32:58.637593', '2023-02-13 19:32:58.637593', 234, '分页查询', NULL, 'iot:device:page', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (239, '2023-02-15 11:21:16.610000', '2023-09-14 15:11:33.154000', NULL, '文件管理', '/upload/list', NULL, 1, 'icon-log', 97, 'modules/upload/views/list.vue', 1, 1);
INSERT INTO `base_sys_menu` VALUES (240, '2023-02-15 14:34:46.552000', '2023-09-20 17:19:59.718000', NULL, '函数开发', NULL, NULL, 0, 'icon-fx', 6, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (241, '2023-02-15 14:35:31.765000', '2023-02-17 16:04:36.963000', 240, '云数据库', '/cloud/db', NULL, 1, 'icon-db', 1, 'modules/cloud/views/db.vue', 1, 1);
INSERT INTO `base_sys_menu` VALUES (242, '2023-02-15 14:33:24.192728', '2023-02-15 14:33:24.192728', 241, '初始化Entity', NULL, 'cloud:db:initEntity', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (243, '2023-02-15 14:33:24.192728', '2023-02-15 14:33:24.192728', 241, '删除', NULL, 'cloud:db:delete', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (244, '2023-02-15 14:33:24.192728', '2023-02-15 14:33:24.192728', 241, '修改', NULL, 'cloud:db:update,cloud:db:info', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (245, '2023-02-15 14:33:24.192728', '2023-02-15 14:33:24.192728', 241, '数据操作测试', NULL, 'cloud:db:data', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (246, '2023-02-15 14:33:24.192728', '2023-02-15 14:33:24.192728', 241, '单个信息', NULL, 'cloud:db:info', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (247, '2023-02-15 14:33:24.192728', '2023-02-15 14:33:24.192728', 241, '列表查询', NULL, 'cloud:db:list', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (248, '2023-02-15 14:33:24.192728', '2023-02-15 14:33:24.192728', 241, '分页查询', NULL, 'cloud:db:page', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (249, '2023-02-15 14:33:24.192728', '2023-02-15 14:33:24.192728', 241, '新增', NULL, 'cloud:db:add', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (250, '2023-02-15 15:17:10.524000', '2023-02-15 15:17:10.524000', 240, '云函数', '/cloud/func/info', NULL, 1, 'icon-menu', 2, 'modules/cloud/views/func/info.vue', 1, 1);
INSERT INTO `base_sys_menu` VALUES (251, '2023-02-15 15:15:02.900934', '2023-02-28 16:08:47.978000', 250, '调用云函数', NULL, 'cloud:func:info:invoke', 2, NULL, 98, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (252, '2023-02-15 15:15:02.900934', '2023-02-15 15:15:02.900934', 250, '删除', NULL, 'cloud:func:info:delete', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (253, '2023-02-15 15:15:02.900934', '2023-02-15 15:15:02.900934', 250, '修改', NULL, 'cloud:func:info:update,cloud:func:info:info', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (254, '2023-02-15 15:15:02.900934', '2023-02-15 15:15:02.900934', 250, '单个信息', NULL, 'cloud:func:info:info', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (255, '2023-02-15 15:15:02.900934', '2023-02-15 15:15:02.900934', 250, '列表查询', NULL, 'cloud:func:info:list', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (256, '2023-02-15 15:15:02.900934', '2023-02-15 15:15:02.900934', 250, '分页查询', NULL, 'cloud:func:info:page', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (257, '2023-02-15 15:15:02.900934', '2023-02-15 15:15:02.900934', 250, '新增', NULL, 'cloud:func:info:add', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (259, '2023-02-17 15:25:20.762000', '2023-02-17 15:25:20.762000', 234, '修改', NULL, 'iot:device:info,iot:device:update', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (260, '2023-02-17 16:26:55.842000', '2023-09-20 17:20:00.932000', NULL, '页面设计', '/design/page', NULL, 1, 'icon-design', 7, 'modules/design/views/page.vue', 1, 1);
INSERT INTO `base_sys_menu` VALUES (261, '2023-02-20 00:12:20.783000', '2023-02-20 00:12:20.783000', 234, '新增', NULL, 'iot:device:add', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (262, '2023-02-20 00:32:45.656000', '2023-02-28 16:08:42.999000', 250, '云函数开发', NULL, 'cloud:func:info:info,cloud:func:info:update,cloud:func:info:invoke', 2, NULL, 99, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (263, '2023-02-20 00:33:17.789000', '2023-02-20 00:33:17.789000', 250, '查看日志', NULL, 'cloud:func:log:page', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (446, '2023-03-06 22:50:24.125000', '2023-03-06 22:50:24.125000', 8, '参数', '/test/aa', NULL, 1, 'icon-goods', 0, 'modules/base/views/info.vue', 1, 1);
INSERT INTO `base_sys_menu` VALUES (447, '2023-03-07 10:26:51.746000', '2023-09-14 16:03:49.682000', NULL, '工作台', NULL, NULL, 0, 'icon-workbench', 1, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (448, '2023-03-07 10:27:21.084000', '2023-03-07 10:27:21.084000', 447, '组件预览', '/demo', NULL, 1, 'icon-favor', 1, 'modules/demo/views/demo.vue', 1, 1);
INSERT INTO `base_sys_menu` VALUES (450, '2023-03-07 10:28:17.692000', '2023-09-11 12:29:43.381000', 447, 'crud 示例', '/demo/crud', NULL, 1, 'icon-favor', 1, 'modules/demo/views/crud.vue', 1, 1);
INSERT INTO `base_sys_menu` VALUES (451, '2023-03-07 10:28:44.322000', '2023-08-16 11:41:58.220000', 447, '编辑器', '/demo/editor', NULL, 1, 'icon-favor', 4, 'modules/demo/views/editor.vue', 1, 1);
INSERT INTO `base_sys_menu` VALUES (452, '2023-03-07 10:29:06.344000', '2023-08-16 11:41:31.982000', 447, '文件上传', '/demo/upload', NULL, 1, 'icon-favor', 3, 'modules/demo/views/upload.vue', 1, 1);
INSERT INTO `base_sys_menu` VALUES (453, '2023-03-15 10:38:43.677000', '2023-03-15 10:38:43.677000', 8, '编辑', NULL, 'base:sys:menu:info,base:sys:menu:update', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (454, '2023-04-16 21:59:16.442000', '2023-09-11 14:53:47.144000', NULL, '用户管理', NULL, NULL, 0, 'icon-user', 8, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (455, '2023-04-16 21:59:58.296000', '2023-09-11 14:53:46.635000', 454, '用户列表', '/user/list', NULL, 1, 'icon-menu', 1, 'modules/user/views/list.vue', 1, 1);
INSERT INTO `base_sys_menu` VALUES (456, '2023-04-16 21:59:58.525729', '2023-04-16 21:59:58.525729', 455, '删除', NULL, 'user:info:delete', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (457, '2023-04-16 21:59:58.525729', '2023-04-16 21:59:58.525729', 455, '修改', NULL, 'user:info:update,user:info:info', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (458, '2023-04-16 21:59:58.525729', '2023-04-16 21:59:58.525729', 455, '单个信息', NULL, 'user:info:info', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (459, '2023-04-16 21:59:58.525729', '2023-04-16 21:59:58.525729', 455, '列表查询', NULL, 'user:info:list', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (460, '2023-04-16 21:59:58.525729', '2023-04-16 21:59:58.525729', 455, '分页查询', NULL, 'user:info:page', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (461, '2023-04-16 21:59:58.525729', '2023-04-16 21:59:58.525729', 455, '新增', NULL, 'user:info:add', 2, NULL, 0, NULL, 1, 1);
INSERT INTO `base_sys_menu` VALUES (562, '2023-09-14 10:21:48.069773', '2023-09-20 18:28:24.604000', NULL, '首页', '/', NULL, 1, NULL, 0, 'modules/demo/views/home/index.vue', 1, 0);
INSERT INTO `base_sys_menu` VALUES (624, '2023-09-28 16:36:11.345000', '2023-09-28 17:02:04.791000', 47, '插件市场', '/tutorial/plugin', NULL, 1, 'icon-app', 1, 'https://cool-js.com/plugin/list.html', 1, 1);
COMMIT;

-- ----------------------------
-- Table structure for base_sys_param
-- ----------------------------
DROP TABLE IF EXISTS `base_sys_param`;
CREATE TABLE `base_sys_param`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `keyName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '键',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '名称',
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '数据',
  `dataType` tinyint NOT NULL DEFAULT 0 COMMENT '数据类型 0-字符串 1-富文本 2-文件 ',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_cf19b5e52d8c71caa9c4534454`(`keyName` ASC) USING BTREE,
  INDEX `IDX_7bcb57371b481d8e2d66ddeaea`(`createTime` ASC) USING BTREE,
  INDEX `IDX_479122e3bf464112f7a7253dac`(`updateTime` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of base_sys_param
-- ----------------------------
INSERT INTO `base_sys_param` VALUES (1, '2021-02-26 13:53:05.000000', '2023-05-31 10:43:23.312000', 'rich', '富文本参数', '<h3><strong>这是一个富文本</strong></h3><p>xxx</p><p>xxxxxxxxxx</p><p><br></p>', 1, NULL);
INSERT INTO `base_sys_param` VALUES (2, '2021-02-26 13:53:18.000000', '2023-05-30 18:46:28.282000', 'json', 'JSON参数', '{\n  \"code\": 111233\n}', 0, NULL);
INSERT INTO `base_sys_param` VALUES (6, '2023-05-30 18:48:25.371000', '2023-05-31 10:44:25.612000', 'file', '文件', '', 2, NULL);
INSERT INTO `base_sys_param` VALUES (8, '2023-05-31 10:07:53.295000', '2023-05-31 10:46:27.960000', 'text', '测试', '这是一段字符串', 0, NULL);

-- ----------------------------
-- Table structure for base_sys_role
-- ----------------------------
DROP TABLE IF EXISTS `base_sys_role`;
CREATE TABLE `base_sys_role` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `userId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '名称',
  `label` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '角色标签',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '备注',
  `relevance` int NOT NULL DEFAULT '1' COMMENT '数据权限是否关联上下级',
  `menuIdList` json NOT NULL COMMENT '菜单权限',
  `departmentIdList` json NOT NULL COMMENT '部门权限',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `IDX_469d49a5998170e9550cf113da` (`name`) USING BTREE,
  UNIQUE KEY `IDX_f3f24fbbccf00192b076e549a7` (`label`) USING BTREE,
  KEY `IDX_6f01184441dec49207b41bfd92` (`createTime`) USING BTREE,
  KEY `IDX_d64ca209f3fc52128d9b20e97b` (`updateTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of base_sys_role
-- ----------------------------
BEGIN;
INSERT INTO `base_sys_role` VALUES (1, '2021-02-24 21:18:39.682358', '2021-02-24 21:18:39.682358', '1', '超管', 'admin', '最高权限的角色', 1, 'null', 'null');
INSERT INTO `base_sys_role` VALUES (10, '2021-02-26 14:15:38.000000', '2021-02-26 14:15:38.000000', '1', '系统管理员', 'admin-sys', NULL, 1, 'null', 'null');
INSERT INTO `base_sys_role` VALUES (11, '2021-02-26 14:16:49.044744', '2021-02-26 14:16:49.044744', '1', '游客', 'visitor', NULL, 0, 'null', 'null');
INSERT INTO `base_sys_role` VALUES (12, '2021-02-26 14:26:51.000000', '2021-02-26 14:32:35.000000', '1', '开发', 'dev', NULL, 0, 'null', 'null');
INSERT INTO `base_sys_role` VALUES (13, '2021-02-26 14:27:58.000000', '2023-02-20 11:01:16.995000', '1', '测试', 'test', NULL, 0, 'null', 'null');
COMMIT;

-- ----------------------------
-- Table structure for base_sys_role_department
-- ----------------------------
DROP TABLE IF EXISTS `base_sys_role_department`;
CREATE TABLE `base_sys_role_department` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `roleId` bigint NOT NULL COMMENT '角色ID',
  `departmentId` bigint NOT NULL COMMENT '部门ID',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `IDX_e881a66f7cce83ba431cf20194` (`createTime`) USING BTREE,
  KEY `IDX_cbf48031efee5d0de262965e53` (`updateTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
INSERT INTO `base_sys_role_department` VALUES (28, '2023-02-20 11:01:23.152883', '2023-02-20 11:01:23.152883', 13, 12);
COMMIT;

-- ----------------------------
-- Table structure for base_sys_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `base_sys_role_menu`;
CREATE TABLE `base_sys_role_menu` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `roleId` bigint NOT NULL COMMENT '角色ID',
  `menuId` bigint NOT NULL COMMENT '菜单ID',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `IDX_3641f81d4201c524a57ce2aa54` (`createTime`) USING BTREE,
  KEY `IDX_f860298298b26e7a697be36e5b` (`updateTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=571 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
INSERT INTO `base_sys_role_menu` VALUES (517, '2023-02-20 11:01:17.272678', '2023-02-20 11:01:17.272678', 13, 1);
INSERT INTO `base_sys_role_menu` VALUES (518, '2023-02-20 11:01:17.384384', '2023-02-20 11:01:17.384384', 13, 96);
INSERT INTO `base_sys_role_menu` VALUES (519, '2023-02-20 11:01:17.509665', '2023-02-20 11:01:17.509665', 13, 45);
INSERT INTO `base_sys_role_menu` VALUES (520, '2023-02-20 11:01:17.613195', '2023-02-20 11:01:17.613195', 13, 43);
INSERT INTO `base_sys_role_menu` VALUES (521, '2023-02-20 11:01:17.717865', '2023-02-20 11:01:17.717865', 13, 49);
INSERT INTO `base_sys_role_menu` VALUES (522, '2023-02-20 11:01:17.821450', '2023-02-20 11:01:17.821450', 13, 86);
INSERT INTO `base_sys_role_menu` VALUES (523, '2023-02-20 11:01:17.928597', '2023-02-20 11:01:17.928597', 13, 2);
INSERT INTO `base_sys_role_menu` VALUES (524, '2023-02-20 11:01:18.042256', '2023-02-20 11:01:18.042256', 13, 27);
INSERT INTO `base_sys_role_menu` VALUES (525, '2023-02-20 11:01:18.152961', '2023-02-20 11:01:18.152961', 13, 97);
INSERT INTO `base_sys_role_menu` VALUES (526, '2023-02-20 11:01:18.264862', '2023-02-20 11:01:18.264862', 13, 59);
INSERT INTO `base_sys_role_menu` VALUES (527, '2023-02-20 11:01:18.375556', '2023-02-20 11:01:18.375556', 13, 60);
INSERT INTO `base_sys_role_menu` VALUES (528, '2023-02-20 11:01:18.486312', '2023-02-20 11:01:18.486312', 13, 61);
INSERT INTO `base_sys_role_menu` VALUES (529, '2023-02-20 11:01:18.604764', '2023-02-20 11:01:18.604764', 13, 62);
INSERT INTO `base_sys_role_menu` VALUES (530, '2023-02-20 11:01:18.708506', '2023-02-20 11:01:18.708506', 13, 63);
INSERT INTO `base_sys_role_menu` VALUES (531, '2023-02-20 11:01:18.810557', '2023-02-20 11:01:18.810557', 13, 65);
INSERT INTO `base_sys_role_menu` VALUES (532, '2023-02-20 11:01:18.912572', '2023-02-20 11:01:18.912572', 13, 98);
INSERT INTO `base_sys_role_menu` VALUES (533, '2023-02-20 11:01:19.012174', '2023-02-20 11:01:19.012174', 13, 99);
INSERT INTO `base_sys_role_menu` VALUES (534, '2023-02-20 11:01:19.111748', '2023-02-20 11:01:19.111748', 13, 100);
INSERT INTO `base_sys_role_menu` VALUES (535, '2023-02-20 11:01:19.210923', '2023-02-20 11:01:19.210923', 13, 101);
INSERT INTO `base_sys_role_menu` VALUES (536, '2023-02-20 11:01:19.314189', '2023-02-20 11:01:19.314189', 13, 8);
INSERT INTO `base_sys_role_menu` VALUES (537, '2023-02-20 11:01:19.428883', '2023-02-20 11:01:19.428883', 13, 10);
INSERT INTO `base_sys_role_menu` VALUES (538, '2023-02-20 11:01:19.552934', '2023-02-20 11:01:19.552934', 13, 11);
INSERT INTO `base_sys_role_menu` VALUES (539, '2023-02-20 11:01:19.663284', '2023-02-20 11:01:19.663284', 13, 12);
INSERT INTO `base_sys_role_menu` VALUES (540, '2023-02-20 11:01:19.771651', '2023-02-20 11:01:19.771651', 13, 13);
INSERT INTO `base_sys_role_menu` VALUES (541, '2023-02-20 11:01:19.879238', '2023-02-20 11:01:19.879238', 13, 22);
INSERT INTO `base_sys_role_menu` VALUES (542, '2023-02-20 11:01:19.987001', '2023-02-20 11:01:19.987001', 13, 23);
INSERT INTO `base_sys_role_menu` VALUES (543, '2023-02-20 11:01:20.095790', '2023-02-20 11:01:20.095790', 13, 24);
INSERT INTO `base_sys_role_menu` VALUES (544, '2023-02-20 11:01:20.201315', '2023-02-20 11:01:20.201315', 13, 25);
INSERT INTO `base_sys_role_menu` VALUES (545, '2023-02-20 11:01:20.308299', '2023-02-20 11:01:20.308299', 13, 26);
INSERT INTO `base_sys_role_menu` VALUES (546, '2023-02-20 11:01:20.414844', '2023-02-20 11:01:20.414844', 13, 69);
INSERT INTO `base_sys_role_menu` VALUES (547, '2023-02-20 11:01:20.528804', '2023-02-20 11:01:20.528804', 13, 70);
INSERT INTO `base_sys_role_menu` VALUES (548, '2023-02-20 11:01:20.635504', '2023-02-20 11:01:20.635504', 13, 71);
INSERT INTO `base_sys_role_menu` VALUES (549, '2023-02-20 11:01:20.749819', '2023-02-20 11:01:20.749819', 13, 72);
INSERT INTO `base_sys_role_menu` VALUES (550, '2023-02-20 11:01:20.864884', '2023-02-20 11:01:20.864884', 13, 73);
INSERT INTO `base_sys_role_menu` VALUES (551, '2023-02-20 11:01:20.970192', '2023-02-20 11:01:20.970192', 13, 74);
INSERT INTO `base_sys_role_menu` VALUES (552, '2023-02-20 11:01:21.074434', '2023-02-20 11:01:21.074434', 13, 75);
INSERT INTO `base_sys_role_menu` VALUES (553, '2023-02-20 11:01:21.179895', '2023-02-20 11:01:21.179895', 13, 76);
INSERT INTO `base_sys_role_menu` VALUES (554, '2023-02-20 11:01:21.286653', '2023-02-20 11:01:21.286653', 13, 77);
INSERT INTO `base_sys_role_menu` VALUES (555, '2023-02-20 11:01:21.389230', '2023-02-20 11:01:21.389230', 13, 78);
INSERT INTO `base_sys_role_menu` VALUES (556, '2023-02-20 11:01:21.498122', '2023-02-20 11:01:21.498122', 13, 79);
INSERT INTO `base_sys_role_menu` VALUES (557, '2023-02-20 11:01:21.608182', '2023-02-20 11:01:21.608182', 13, 80);
INSERT INTO `base_sys_role_menu` VALUES (558, '2023-02-20 11:01:21.716534', '2023-02-20 11:01:21.716534', 13, 81);
INSERT INTO `base_sys_role_menu` VALUES (559, '2023-02-20 11:01:21.821921', '2023-02-20 11:01:21.821921', 13, 82);
INSERT INTO `base_sys_role_menu` VALUES (560, '2023-02-20 11:01:21.924088', '2023-02-20 11:01:21.924088', 13, 83);
INSERT INTO `base_sys_role_menu` VALUES (561, '2023-02-20 11:01:22.027509', '2023-02-20 11:01:22.027509', 13, 105);
INSERT INTO `base_sys_role_menu` VALUES (562, '2023-02-20 11:01:22.138587', '2023-02-20 11:01:22.138587', 13, 102);
INSERT INTO `base_sys_role_menu` VALUES (563, '2023-02-20 11:01:22.248197', '2023-02-20 11:01:22.248197', 13, 103);
INSERT INTO `base_sys_role_menu` VALUES (564, '2023-02-20 11:01:22.348024', '2023-02-20 11:01:22.348024', 13, 29);
INSERT INTO `base_sys_role_menu` VALUES (565, '2023-02-20 11:01:22.450315', '2023-02-20 11:01:22.450315', 13, 30);
INSERT INTO `base_sys_role_menu` VALUES (566, '2023-02-20 11:01:22.561988', '2023-02-20 11:01:22.561988', 13, 47);
INSERT INTO `base_sys_role_menu` VALUES (567, '2023-02-20 11:01:22.672138', '2023-02-20 11:01:22.672138', 13, 48);
INSERT INTO `base_sys_role_menu` VALUES (568, '2023-02-20 11:01:22.791173', '2023-02-20 11:01:22.791173', 13, 84);
INSERT INTO `base_sys_role_menu` VALUES (569, '2023-02-20 11:01:22.898018', '2023-02-20 11:01:22.898018', 13, 90);
INSERT INTO `base_sys_role_menu` VALUES (570, '2023-02-20 11:01:23.008575', '2023-02-20 11:01:23.008575', 13, 85);
COMMIT;

-- ----------------------------
-- Table structure for base_sys_user
-- ----------------------------
DROP TABLE IF EXISTS `base_sys_user`;
CREATE TABLE `base_sys_user` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `departmentId` bigint DEFAULT NULL COMMENT '部门ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '姓名',
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '密码',
  `passwordV` int NOT NULL DEFAULT '1' COMMENT '密码版本, 作用是改完密码，让原来的token失效',
  `nickName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '昵称',
  `headImg` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '头像',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '手机',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '邮箱',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态 0:禁用 1：启用',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '备注',
  `socketId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'socketId',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `IDX_469ad55973f5b98930f6ad627b` (`username`) USING BTREE,
  KEY `IDX_0cf944da378d70a94f5fefd803` (`departmentId`) USING BTREE,
  KEY `IDX_9ec6d7ac6337eafb070e4881a8` (`phone`) USING BTREE,
  KEY `IDX_ca8611d15a63d52aa4e292e46a` (`createTime`) USING BTREE,
  KEY `IDX_a0f2f19cee18445998ece93ddd` (`updateTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of base_sys_user
-- ----------------------------
BEGIN;
INSERT INTO `base_sys_user` VALUES (1, '2021-02-24 21:16:41.525157', '2023-03-08 15:11:51.000000', 1, '超级管理员', 'admin', 'e10adc3949ba59abbe56e057f20f883e', 7, '管理员', 'https://show.cool-admin.com/api/public/uploads/20230308/c731b0cba84046268b10edbbcf36f948_315c243a448e1369fa145c5ea3f020da.gif', '18000000000', 'team@cool-js.com', 1, '拥有最高权限的用户', NULL);
INSERT INTO `base_sys_user` VALUES (24, '2021-02-26 14:17:38.000000', '2023-03-06 20:18:58.000000', 1, '小白', 'xiaobai', 'e10adc3949ba59abbe56e057f20f883e', 1, '小白', 'https://show.cool-admin.com/api/public/uploads/20230306/2e8a293ebfd8495083af93da141b045e_f85bccf6f4cf4890aea4e963e658fb94_1675933340_tplv-dy-cropcenter_323_430.jpg', NULL, NULL, 1, NULL, NULL);
INSERT INTO `base_sys_user` VALUES (25, '2021-02-26 14:28:25.000000', '2023-03-06 20:18:53.000000', 1, '小黑', 'xiaohei', 'e10adc3949ba59abbe56e057f20f883e', 1, '小黑', 'https://show.cool-admin.com/api/public/uploads/20230306/0bd3095dd14c4ef89cf1e04c66b62900_e7b3653e07224702a1e8f246453d7d72_tplv-dy-cropcenter_323_430.jpg', NULL, NULL, 1, NULL, NULL);
INSERT INTO `base_sys_user` VALUES (26, '2021-02-26 14:28:49.000000', '2023-03-06 20:18:48.000000', 1, '小绿', 'xiaolv', 'e10adc3949ba59abbe56e057f20f883e', 1, '小绿', 'https://show.cool-admin.com/api/public/uploads/20230306/84bff75c07e44eff9beef880fd91e9cb_467d1550bcfc46968deb294b756ff52e_1674986122_tplv-dy-cropcenter_323_430.jpg', NULL, NULL, 1, NULL, NULL);
INSERT INTO `base_sys_user` VALUES (27, '2021-02-26 14:29:23.000000', '2023-03-07 13:15:00.000000', 1, '小青', 'xiaoqin', 'e10adc3949ba59abbe56e057f20f883e', 1, '小青', 'https://show.cool-admin.com/api/public/uploads/20230306/fb49e291d4a44c659367f17751699e04_2c0f4758d8484271be34081c8fe49adc_1675679254_tplv-dy-cropcenter_323_430.jpg', NULL, NULL, 1, NULL, NULL);
INSERT INTO `base_sys_user` VALUES (28, '2021-02-26 14:29:52.000000', '2023-03-06 19:57:46.000000', 1, '神仙都没用', 'icssoa', 'e10adc3949ba59abbe56e057f20f883e', 1, '神仙都没用', 'https://show.cool-admin.com/api/public/uploads/20230306/26942e8aa783427f8ad73c1a10fcac6f_eb26da2fc07940b1bb63f1510933eb01_1676971271_tplv-dy-cropcenter_323_430.jpg', NULL, NULL, 1, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for base_sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `base_sys_user_role`;
CREATE TABLE `base_sys_user_role` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `userId` bigint NOT NULL COMMENT '用户ID',
  `roleId` bigint NOT NULL COMMENT '角色ID',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `IDX_fa9555e03e42fce748c9046b1c` (`createTime`) USING BTREE,
  KEY `IDX_3e36c0d2b1a4c659c6b4fc64b3` (`updateTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
INSERT INTO `base_sys_user_role` VALUES (45, '2023-02-16 19:11:10.029945', '2023-02-16 19:11:10.029945', 29, 10);
INSERT INTO `base_sys_user_role` VALUES (46, '2023-03-06 19:57:46.215729', '2023-03-06 19:57:46.215729', 28, 12);
INSERT INTO `base_sys_user_role` VALUES (47, '2023-03-06 19:57:46.228651', '2023-03-06 19:57:46.228651', 28, 10);
INSERT INTO `base_sys_user_role` VALUES (49, '2023-03-06 20:18:48.992031', '2023-03-06 20:18:48.992031', 26, 13);
INSERT INTO `base_sys_user_role` VALUES (50, '2023-03-06 20:18:53.818567', '2023-03-06 20:18:53.818567', 25, 13);
INSERT INTO `base_sys_user_role` VALUES (51, '2023-03-06 20:18:58.691102', '2023-03-06 20:18:58.691102', 24, 12);
INSERT INTO `base_sys_user_role` VALUES (52, '2023-03-06 20:28:45.169085', '2023-03-06 20:28:45.169085', 30, 11);
INSERT INTO `base_sys_user_role` VALUES (53, '2023-03-07 11:39:57.672383', '2023-03-07 11:39:57.672383', 31, 10);
INSERT INTO `base_sys_user_role` VALUES (54, '2023-03-07 13:15:00.326613', '2023-03-07 13:15:00.326613', 27, 11);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
