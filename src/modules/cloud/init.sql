
-- ----------------------------
-- Records of cloud_db
-- ----------------------------
BEGIN;
INSERT INTO `cloud_db` VALUES (13, '2023-02-16 19:25:21.995000', '2023-02-23 12:00:43.621000', '用户', NULL, 'import { BaseEntity } from \'@cool-midway/core\';\nimport { Column, Entity } from \'typeorm\';\n\n/**\n * 描述\n */\n@Entity(\'user\')\nexport class UserEntity extends BaseEntity {\n    @Column({ comment: \'姓名\' })\n    name: string;\n    @Column({ comment: \'年龄\' })\n    age: string;\n}', 'UserEntity', 'func_user', 1);
COMMIT;


-- ----------------------------
-- Records of cloud_func_info
-- ----------------------------
BEGIN;
INSERT INTO `cloud_func_info` VALUES (1, '2023-02-15 15:29:00.010000', '2023-03-07 04:14:27.212000', '测试', 'ddd', 'import { CloudCrud } from \'@cool-midway/cloud\';\n\n/**\n * 描述\n */\nexport class User extends CloudCrud {\n    async main() {\n        this.setCurdOption({\n            entity: \'TestUserEntity\',\n            api: [\"add\", \"page\"]\n        });\n    }\n}', 1);
INSERT INTO `cloud_func_info` VALUES (2, '2023-02-16 01:21:20.485000', '2023-03-07 04:14:26.372000', '用户1', NULL, 'import { CloudCrud } from \'@cool-midway/cloud\';\n\n/**\n * 描述\n */\nexport class Xxx extends CloudCrud {\n  async main() {\n    this.setCurdOption({\n      entity: \'UserEntity\',\n      api: [\'add\', \'delete\', \'update\', \'info\', \'list\', \'page\']\n    });\n  }\n}\n', 0);
COMMIT;

