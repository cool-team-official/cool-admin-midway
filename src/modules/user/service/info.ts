import { Inject, Provide } from '@midwayjs/decorator';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { UserInfoEntity } from '../entity/info';
import { CoolFile } from '@cool-midway/file';
import { v1 as uuid } from 'uuid';

/**
 * 用户信息
 */
@Provide()
export class UserInfoService extends BaseService {
  @InjectEntityModel(UserInfoEntity)
  userInfoEntity: Repository<UserInfoEntity>;

  @Inject()
  file: CoolFile;

  /**
   * 获取用户信息
   * @param id
   * @returns
   */
  async person(id) {
    return await this.userInfoEntity.findOneBy({ id });
  }

  async updatePerson(id, param) {
    const info = await this.person(id);
    // 修改了头像要重新处理
    if (param.avatarUrl && info.avatarUrl != param.avatarUrl) {
      param.avatarUrl = await this.file.downAndUpload(
        param.avatarUrl,
        uuid() + '.png'
      );
    }
    return await this.userInfoEntity.update({ id }, param);
  }
}
