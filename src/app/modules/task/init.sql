BEGIN;
INSERT INTO `task_info` VALUES (1, '2021-03-10 14:25:13.381172', '2021-03-10 14:25:19.011000', NULL, '{\"count\":1,\"type\":1,\"limit\":5,\"name\":\"每秒执行,总共5次\",\"taskType\":1,\"every\":1000,\"service\":\"taskDemoService.test()\",\"status\":1,\"id\":1,\"createTime\":\"2021-03-10 14:25:13\",\"updateTime\":\"2021-03-10 14:25:13\",\"jobId\":1}', '每秒执行,总共5次', NULL, 5, 1000, NULL, 0, NULL, NULL, NULL, 'taskDemoService.test()', 1, '2021-03-10 14:25:18', 1);
INSERT INTO `task_info` VALUES (2, '2021-03-10 14:25:53.000000', '2021-03-10 14:26:18.209202', NULL, '{\"count\":1,\"id\":2,\"createTime\":\"2021-03-10 14:25:53\",\"updateTime\":\"2021-03-10 14:25:55\",\"name\":\"cron任务，5秒执行一次\",\"cron\":\"0/5 * * * * ? \",\"status\":1,\"service\":\"taskDemoService.test()\",\"type\":1,\"nextRunTime\":\"2021-03-10 14:26:00\",\"taskType\":0,\"jobId\":2}', 'cron任务，5秒执行一次', '0/5 * * * * ? ', NULL, NULL, NULL, 0, NULL, NULL, NULL, 'taskDemoService.test()', 1, NULL, 0);
COMMIT;

BEGIN;
INSERT INTO `task_log` VALUES (1, '2021-03-10 14:25:14.020930', '2021-03-10 14:25:14.020930', 1, 1, '\"任务执行成功\"');
INSERT INTO `task_log` VALUES (2, '2021-03-10 14:25:15.012030', '2021-03-10 14:25:15.012030', 1, 1, '\"任务执行成功\"');
INSERT INTO `task_log` VALUES (3, '2021-03-10 14:25:16.011443', '2021-03-10 14:25:16.011443', 1, 1, '\"任务执行成功\"');
INSERT INTO `task_log` VALUES (4, '2021-03-10 14:25:17.009939', '2021-03-10 14:25:17.009939', 1, 1, '\"任务执行成功\"');
INSERT INTO `task_log` VALUES (5, '2021-03-10 14:25:18.010410', '2021-03-10 14:25:18.010410', 1, 1, '\"任务执行成功\"');
INSERT INTO `task_log` VALUES (6, '2021-03-10 14:25:55.012816', '2021-03-10 14:25:55.012816', 2, 1, '');
INSERT INTO `task_log` VALUES (7, '2021-03-10 14:26:00.011880', '2021-03-10 14:26:00.011880', 2, 1, '');
INSERT INTO `task_log` VALUES (8, '2021-03-10 14:26:05.016832', '2021-03-10 14:26:05.016832', 2, 1, '\"任务执行成功\"');
INSERT INTO `task_log` VALUES (9, '2021-03-10 14:26:10.011763', '2021-03-10 14:26:10.011763', 2, 1, '\"任务执行成功\"');
INSERT INTO `task_log` VALUES (10, '2021-03-10 14:26:15.010246', '2021-03-10 14:26:15.010246', 2, 1, '\"任务执行成功\"');
COMMIT;