
-- ----------------------------
-- Records of dict_info
-- ----------------------------
BEGIN;
INSERT INTO `dict_info` VALUES (21, '2023-03-06 11:40:51.312000', '2023-03-06 11:40:51.312000', 19, 'COOL', 1, NULL, NULL);
INSERT INTO `dict_info` VALUES (22, '2023-03-06 11:40:59.000000', '2023-03-06 11:42:00.000000', 19, '闪酷', 2, NULL, NULL);
INSERT INTO `dict_info` VALUES (23, '2023-03-06 11:41:20.581000', '2023-03-06 11:41:20.581000', 20, '法师', 1, NULL, NULL);
INSERT INTO `dict_info` VALUES (24, '2023-03-06 11:41:25.740000', '2023-03-06 11:41:45.818000', 20, '战士', 2, NULL, NULL);
INSERT INTO `dict_info` VALUES (25, '2023-03-06 11:41:31.297000', '2023-03-06 11:41:48.661000', 20, '坦克', 3, NULL, NULL);
INSERT INTO `dict_info` VALUES (26, '2023-03-06 11:41:35.987000', '2023-03-06 11:41:51.078000', 20, '刺客', 4, NULL, NULL);
INSERT INTO `dict_info` VALUES (27, '2023-03-06 11:41:41.430000', '2023-03-06 11:41:54.159000', 20, '射手', 5, NULL, NULL);
INSERT INTO `dict_info` VALUES (28, '2023-03-06 16:38:18.986000', '2023-03-06 16:38:18.986000', 20, '123', 1, '123', 27);
COMMIT;

-- ----------------------------
-- Records of dict_type
-- ----------------------------
BEGIN;
INSERT INTO `dict_type` VALUES (19, '2023-03-06 11:40:45.295000', '2023-03-06 11:40:45.295000', '品牌', 'brand');
INSERT INTO `dict_type` VALUES (20, '2023-03-06 11:41:13.227000', '2023-03-06 11:41:13.227000', '职业', 'occupation');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
