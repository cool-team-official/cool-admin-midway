import { Inject, InjectClient, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, In, Repository } from 'typeorm';
import { BaseSysUserEntity } from '../../entity/sys/user';
import { BaseSysPermsService } from './perms';
import * as _ from 'lodash';
import { BaseSysUserRoleEntity } from '../../entity/sys/user_role';
import * as md5 from 'md5';
import { BaseSysDepartmentEntity } from '../../entity/sys/department';
import { CachingFactory, MidwayCache } from '@midwayjs/cache-manager';
import { BaseSysRoleEntity } from '../../entity/sys/role';

/**
 * 系统用户
 * 
 * 【设计模式注释】
 * 1. 服务层模式 (Service Layer Pattern): 该类作为业务逻辑层，封装了用户管理的所有业务逻辑
 * 2. 依赖注入模式 (Dependency Injection Pattern): 通过 @Inject 等装饰器注入依赖项
 * 3. 仓储模式 (Repository Pattern): 通过 Repository 类型的属性操作数据库
 * 4. 模板方法模式 (Template Method Pattern): 继承自 BaseService，复用基础 CRUD 操作
 * 
 * 【算法实现注释】
 * 1. 权限检查算法: 通过 baseSysPermsService.departmentIds() 实现部门权限控制
 * 2. 密码加密算法: 使用 MD5 对用户密码进行哈希处理
 * 3. 关联查询算法: 在 page 方法中实现用户与角色、部门的关联查询
 * 4. 缓存管理算法: 使用 midwayCache 进行令牌和权限信息的缓存管理
 * 
 * 【代码规范注释】
 * 1. 命名规范: 遵循 camelCase 命名约定
 * 2. 类职责单一: 专门处理系统用户相关业务逻辑
 * 3. 异常处理: 使用 CoolCommException 统一异常处理机制
 * 4. 安全性: 密码加密存储，敏感信息脱敏返回
 */
@Provide()
export class BaseSysUserService extends BaseService {
  // 【设计模式-仓储模式】注入用户实体仓储，用于数据库操作
  @InjectEntityModel(BaseSysUserEntity)
  baseSysUserEntity: Repository<BaseSysUserEntity>;

  // 【设计模式-仓储模式】注入用户角色关联实体仓储
  @InjectEntityModel(BaseSysUserRoleEntity)
  baseSysUserRoleEntity: Repository<BaseSysUserRoleEntity>;

  // 【设计模式-仓储模式】注入部门实体仓储
  @InjectEntityModel(BaseSysDepartmentEntity)
  baseSysDepartmentEntity: Repository<BaseSysDepartmentEntity>;

  // 【设计模式-依赖注入】注入缓存客户端，实现缓存策略
  @InjectClient(CachingFactory, 'default')
  midwayCache: MidwayCache;

  // 【设计模式-依赖注入】注入权限服务，实现权限管理功能
  @Inject()
  baseSysPermsService: BaseSysPermsService;

  // 【设计模式-依赖注入】注入上下文对象，获取当前请求相关信息
  @Inject()
  ctx;

  /**
   * 分页查询
   * 
   * 【算法实现注释】
   * 1. 权限过滤算法: 根据当前用户权限获取可访问的部门ID列表
   * 2. 动态SQL构建算法: 使用 setSql 方法根据查询条件动态拼接SQL语句
   * 3. 多表关联查询算法: LEFT JOIN 关联用户表和部门表获取部门名称
   * 4. 关联角色查询算法: 单独查询用户角色信息并映射到结果集中
   * 
   * 【性能优化】
   * 1. 使用原生SQL提高复杂查询性能
   * 2. 分离主表查询和关联角色查询，避免笛卡尔积
   * 
   * @param query 查询参数对象
   */
  async page(query) {
    const { keyWord, status, departmentIds = [] } = query;
    const userId = this.ctx.admin.userId;
    
    // 【算法实现-权限检查算法】获取当前用户的部门权限列表
    const permsDepartmentArr = await this.baseSysPermsService.departmentIds(
      userId
    ); // 部门权限
    
    // 【算法实现-动态SQL构建算法】根据查询条件动态构建SQL语句
    const sql = `
        SELECT
            a.id,a.name,a.nickName,a.headImg,a.email,a.remark,a.status,a.createTime,a.updateTime,a.username,a.phone,a.departmentId,
            b.name as "departmentName"
        FROM
            base_sys_user a
            LEFT JOIN base_sys_department b on a.departmentId = b.id
        WHERE 1 = 1
            ${this.setSql(
              !_.isEmpty(departmentIds),
              'and a.departmentId in (?)',
              [departmentIds]
            )}
            ${this.setSql(status, 'and a.status = ?', [status])}
            ${this.setSql(keyWord, 'and (a.name LIKE ? or a.username LIKE ?)', [
              `%${keyWord}%`,
              `%${keyWord}%`,
            ])}
            ${this.setSql(true, 'and a.username != ?', ['admin'])}  // 排除超级管理员账号
            ${this.setSql(
              this.ctx.admin.username !== 'admin',  // 超级管理员不受权限限制
              `and (a.departmentId in (?) or a.userId = ${userId})`,
              [!_.isEmpty(permsDepartmentArr) ? permsDepartmentArr : [null]]
            )} `;
    
    // 【设计模式-服务层模式】调用基础服务的分页渲染方法
    const result = await this.sqlRenderPage(sql, query);
    
    // 【算法实现-关联查询算法】单独查询用户角色信息，避免复杂JOIN导致的性能问题
    if (!_.isEmpty(result.list)) {
      const userIds = result.list.map(e => e.id);
      const roles: BaseSysRoleEntity[] = await this.nativeQuery(
        'SELECT b.name, a.userId FROM base_sys_user_role a LEFT JOIN base_sys_role b ON a.roleId = b.id WHERE a.userId in (?) ',
        [userIds]
      );
      
      // 【算法实现-数据映射算法】将角色信息映射到用户列表中
      result.list.forEach(e => {
        const arr = roles.filter(a => a.userId == e.id);

        e['roleIds'] = arr.map(a => a.userId);
        e['roleName'] = arr.map(a => a.name).join(',');
      });
    }
    return result;
  }

  /**
   * 移动部门
   * @param departmentId
   * @param userIds
   */
  async move(departmentId, userIds) {
    await this.baseSysUserEntity.update({ id: In(userIds) }, { departmentId });
  }

  /**
   * 获得个人信息
   */
  async person(userId) {
    const info = await this.baseSysUserEntity.findOneBy({
      id: Equal(userId),
    });
    delete info?.password;
    return info;
  }

  /**
   * 更新用户角色关系
   * @param user
   */
  async updateUserRole(user) {
    if (_.isEmpty(user.roleIdList)) {
      return;
    }
    if (user.username === 'admin') {
      throw new CoolCommException('非法操作~');
    }
    await this.baseSysUserRoleEntity.delete({ userId: user.id });
    if (user.roleIdList) {
      for (const roleId of user.roleIdList) {
        await this.baseSysUserRoleEntity.save({ userId: user.id, roleId });
      }
    }
    await this.baseSysPermsService.refreshPerms(user.id);
  }

  /**
   * 新增用户
   * 
   * 【业务逻辑注释】
   * 1. 用户名校验逻辑: 检查用户名是否已存在
   * 2. 密码加密逻辑: 对用户密码进行MD5加密
   * 3. 角色分配逻辑: 为新用户分配指定的角色
   * 
   * 【安全算法注释】
   * 1. 密码哈希算法: 使用MD5对密码进行哈希处理（注意：生产环境建议使用bcrypt等更安全的算法）
   * 2. 唯一性校验算法: 防止重复用户名注册
   * 
   * @param param 用户参数对象
   */
  async add(param) {
    // 【算法实现-唯一性校验算法】检查用户名是否已存在
    const exists = await this.baseSysUserEntity.findOneBy({
      username: param.username,
    });
    if (!_.isEmpty(exists)) {
      throw new CoolCommException('用户名已经存在~');
    }
    
    // 【算法实现-密码加密算法】对用户密码进行MD5哈希处理
    param.password = md5(param.password);
    
    // 【设计模式-模板方法模式】调用父类BaseService的add方法
    await super.add(param);
    
    // 【业务逻辑-角色管理】更新用户角色关联关系
    await this.updateUserRole(param);
    return param.id;
  }

  /**
   * 根据ID获得信息
   * @param id
   */
  public async info(id) {
    const info = await this.baseSysUserEntity.findOneBy({ id });
    const userRoles = await this.nativeQuery(
      'select a.roleId from base_sys_user_role a where a.userId = ?',
      [id]
    );
    const department = await this.baseSysDepartmentEntity.findOneBy({
      id: info.departmentId,
    });
    if (info) {
      delete info.password;
      if (userRoles) {
        info.roleIdList = userRoles.map(e => {
          return parseInt(e.roleId);
        });
      }
    }
    delete info.password;
    if (department) {
      info.departmentName = department.name;
    }
    return info;
  }

  /**
   * 修改个人信息
   * @param param
   */
  public async personUpdate(param) {
    param.id = this.ctx.admin.userId;
    if (!_.isEmpty(param.password)) {
      param.password = md5(param.password);
      const oldPassword = md5(param.oldPassword);
      const userInfo = await this.baseSysUserEntity.findOneBy({ id: param.id });
      if (!userInfo) {
        throw new CoolCommException('用户不存在');
      }
      if (oldPassword !== userInfo.password) {
        throw new CoolCommException('原密码错误');
      }
      param.passwordV = userInfo.passwordV + 1;
      await this.midwayCache.set(
        `admin:passwordVersion:${param.id}`,
        param.passwordV
      );
    } else {
      delete param.password;
    }
    await this.baseSysUserEntity.save(param);
  }

  /**
   * 修改用户信息
   * 
   * 【业务逻辑注释】
   * 1. 超级管理员保护逻辑: 防止修改admin账户
   * 2. 密码更新逻辑: 加密新密码并更新密码版本号
   * 3. 缓存失效逻辑: 当密码更改时使旧令牌失效
   * 4. 状态变更逻辑: 根据用户状态决定是否禁用用户
   * 
   * 【安全算法注释】
   * 1. 密码版本控制算法: 通过递增版本号使旧令牌失效
   * 2. 账户锁定算法: 通过缓存删除实现用户禁用
   * 
   * @param param 用户参数对象
   */
  async update(param) {
    // 【安全算法-访问控制算法】防止修改超级管理员账户
    if (param.id && param.username === 'admin') {
      throw new CoolCommException('非法操作~');
    }
    
    // 【业务逻辑-密码更新流程】处理密码修改
    if (!_.isEmpty(param.password)) {
      // 【算法实现-密码加密算法】对新密码进行MD5哈希处理
      param.password = md5(param.password);
      
      // 【算法实现-数据一致性算法】验证用户是否存在
      const userInfo = await this.baseSysUserEntity.findOneBy({ id: param.id });
      if (!userInfo) {
        throw new CoolCommException('用户不存在');
      }
      
      // 【算法实现-密码版本控制算法】递增密码版本号，使旧令牌失效
      param.passwordV = userInfo.passwordV + 1;
      
      // 【算法实现-缓存管理算法】更新密码版本缓存，实现令牌失效
      await this.midwayCache.set(
        `admin:passwordVersion:${param.id}`,
        param.passwordV
      );
    } else {
      delete param.password;
    }
    
    // 【业务逻辑-状态管理】如果用户状态为禁用，则同时禁用其访问权限
    if (param.status === 0) {
      await this.forbidden(param.id);
    }
    
    // 【设计模式-仓储模式】使用仓储保存用户信息
    await this.baseSysUserEntity.save(param);
    
    // 【业务逻辑-角色管理】更新用户角色关联关系
    await this.updateUserRole(param);
  }

  /**
   * 禁用用户
   * 
   * 【安全算法注释】
   * 1. 令牌失效算法: 通过删除缓存中的令牌实现用户访问禁用
   * 2. 即时生效算法: 删除缓存后用户立即无法访问系统
   * 
   * @param userId 用户ID
   */
  async forbidden(userId) {
    // 【算法实现-令牌失效算法】删除指定用户的认证令牌，使其立即无法访问系统
    await this.midwayCache.del(`admin:token:${userId}`);
  }
}
