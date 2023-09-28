DROP TABLE IF EXISTS `dict_info`;
CREATE TABLE `dict_info`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `typeId` int NOT NULL COMMENT '类型ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '名称',
  `orderNum` int NOT NULL DEFAULT 0 COMMENT '排序',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备注',
  `parentId` int NULL DEFAULT NULL COMMENT '父ID',
  `value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '值',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `IDX_5c311a4af30de1181a5d7a7cc2`(`createTime` ASC) USING BTREE,
  INDEX `IDX_10362a62adbf120821fff209d8`(`updateTime` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;
-- ----------------------------
-- Records of dict_info
-- ----------------------------
BEGIN;
INSERT INTO `dict_info` VALUES (21, '2023-03-06 11:40:51.312000', '2023-09-07 19:53:42.964000', 19, 'COOL', 1, NULL, NULL, 'cool');
INSERT INTO `dict_info` VALUES (22, '2023-03-06 11:40:59.000000', '2023-09-08 17:20:00.448000', 19, '闪酷', 2, NULL, NULL, 'https://show.cool-admin.com/api/public/uploads/20230308/c731b0cba84046268b10edbbcf36f948_315c243a448e1369fa145c5ea3f020da.gif');
INSERT INTO `dict_info` VALUES (23, '2023-03-06 11:41:20.581000', '2023-09-08 19:15:18.679000', 20, '法师', 1, NULL, NULL, '4');
INSERT INTO `dict_info` VALUES (24, '2023-03-06 11:41:25.740000', '2023-09-08 19:15:15.840000', 20, '战士', 2, NULL, NULL, '3');
INSERT INTO `dict_info` VALUES (25, '2023-03-06 11:41:31.297000', '2023-09-08 19:15:09.179000', 20, '坦克', 3, NULL, NULL, '2');
INSERT INTO `dict_info` VALUES (26, '2023-03-06 11:41:35.987000', '2023-09-08 19:15:05.012000', 20, '刺客', 4, NULL, NULL, '1');
INSERT INTO `dict_info` VALUES (27, '2023-03-06 11:41:41.430000', '2023-09-08 19:15:01.419000', 20, '射手', 5, NULL, NULL, '0');
INSERT INTO `dict_info` VALUES (30, '2023-09-09 21:28:43.349000', '2023-09-09 21:28:43.349000', 20, '幻影刺客', 1, NULL, 26, '5');
COMMIT;


DROP TABLE IF EXISTS `dict_type`;
CREATE TABLE `dict_type`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '名称',
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '标识',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `IDX_69734e5c2d29cc2139d5078f2c`(`createTime` ASC) USING BTREE,
  INDEX `IDX_6cccb2e33846cd354e8dc0e0ef`(`updateTime` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;
-- ----------------------------
-- Records of dict_type
-- ----------------------------
BEGIN;
INSERT INTO `dict_type` VALUES (19, '2023-03-06 11:40:45.295000', '2023-03-06 11:40:45.295000', '品牌', 'brand');
INSERT INTO `dict_type` VALUES (20, '2023-03-06 11:41:13.227000', '2023-03-06 11:41:13.227000', '职业', 'occupation');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
