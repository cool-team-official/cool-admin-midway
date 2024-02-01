import { App, IMidwayApplication, Scope, ScopeEnum } from '@midwayjs/core';
import { ALL, Config, Inject, Provide } from '@midwayjs/decorator';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { In, Repository } from 'typeorm';
import { BaseSysMenuEntity } from '../../entity/sys/menu';
import * as _ from 'lodash';
import { BaseSysPermsService } from './perms';
import { Context } from '@midwayjs/koa';
import { TempDataSource } from './data';
// eslint-disable-next-line node/no-unpublished-import
import * as ts from 'typescript';
import * as fs from 'fs';
import * as pathUtil from 'path';
import { BaseSysRoleMenuEntity } from '../../entity/sys/role_menu';
import { BaseSysUserRoleEntity } from '../../entity/sys/user_role';

/**
 * 菜单
 */
@Scope(ScopeEnum.Request, { allowDowngrade: true })
@Provide()
export class BaseSysMenuService extends BaseService {
  @Inject()
  ctx: Context;

  @InjectEntityModel(BaseSysMenuEntity)
  baseSysMenuEntity: Repository<BaseSysMenuEntity>;

  @InjectEntityModel(BaseSysRoleMenuEntity)
  baseSysRoleMenuEntity: Repository<BaseSysRoleMenuEntity>;

  @Inject()
  baseSysPermsService: BaseSysPermsService;

  @Config(ALL)
  config;

  @App()
  app: IMidwayApplication;

  /**
   * 获得所有菜单
   */
  async list() {
    const menus = await this.getMenus(
      this.ctx.admin.roleIds,
      this.ctx.admin.username === 'admin'
    );
    if (!_.isEmpty(menus)) {
      menus.forEach((e: any) => {
        const parentMenu = menus.filter(m => {
          e.parentId = parseInt(e.parentId);
          if (e.parentId == m.id) {
            return m.name;
          }
        });
        if (!_.isEmpty(parentMenu)) {
          e.parentName = parentMenu[0].name;
        }
      });
    }
    return menus;
  }

  /**
   * 修改之后
   * @param param
   */
  async modifyAfter(param) {
    if (param.id) {
      await this.refreshPerms(param.id);
    }
  }

  /**
   * 根据角色获得权限信息
   * @param {[]} roleIds 数组
   */
  async getPerms(roleIds) {
    let perms = [];
    if (!_.isEmpty(roleIds)) {
      const find = await this.baseSysMenuEntity.createQueryBuilder('a');
      if (!roleIds.includes(1)) {
        find.innerJoinAndSelect(
          BaseSysRoleMenuEntity,
          'b',
          'a.id = b.menuId AND b.roleId in (:...roleIds)',
          { roleIds }
        );
      }
      find.where('a.perms is not NULL');
      const result = await find.getMany();
      if (result) {
        result.forEach(d => {
          if (d.perms) {
            perms = perms.concat(d.perms.split(','));
          }
        });
      }
      perms = _.uniq(perms);
      perms = _.remove(perms, n => {
        return !_.isEmpty(n);
      });
    }
    return _.uniq(perms);
  }

  /**
   * 获得用户菜单信息
   * @param roleIds
   * @param isAdmin 是否是超管
   */
  async getMenus(roleIds, isAdmin) {
    const find = this.baseSysMenuEntity.createQueryBuilder('a');
    if (!isAdmin) {
      find.innerJoinAndSelect(
        BaseSysRoleMenuEntity,
        'b',
        'a.id = b.menuId AND b.roleId in (:...roleIds)',
        { roleIds }
      );
    }
    find.orderBy('a.orderNum', 'ASC');
    const list = await find.getMany();
    return _.uniqBy(list, 'id');
  }

  /**
   * 删除
   * @param ids
   */
  async delete(ids) {
    let idArr;
    if (ids instanceof Array) {
      idArr = ids;
    } else {
      idArr = ids.split(',');
    }
    for (const id of idArr) {
      await this.baseSysMenuEntity.delete({ id });
      await this.delChildMenu(id);
    }
  }

  /**
   * 删除子菜单
   * @param id
   */
  private async delChildMenu(id) {
    await this.refreshPerms(id);
    const delMenu = await this.baseSysMenuEntity.findBy({ parentId: id });
    if (_.isEmpty(delMenu)) {
      return;
    }
    const delMenuIds = delMenu.map(e => {
      return e.id;
    });
    await this.baseSysMenuEntity.delete(delMenuIds);
    for (const menuId of delMenuIds) {
      await this.delChildMenu(menuId);
    }
  }

  /**
   * 更新权限
   * @param menuId
   */
  async refreshPerms(menuId) {
    const find = this.baseSysRoleMenuEntity.createQueryBuilder('a');
    find.leftJoinAndSelect(BaseSysUserRoleEntity, 'b', 'a.roleId = b.roleId');
    find.where('a.menuId = :menuId', { menuId: menuId });
    find.select('b.userId', 'userId');
    const users = await find.getRawMany();
    // 刷新admin权限
    await this.baseSysPermsService.refreshPerms(1);
    if (!_.isEmpty(users)) {
      // 刷新其他权限
      for (const user of _.uniqBy(users, 'userId')) {
        await this.baseSysPermsService.refreshPerms(user.userId);
      }
    }
  }

  /**
   * 解析实体和Controller
   * @param entityString
   * @param controller
   * @param module
   */
  async parse(entityString: string, controller: string, module: string) {
    const tempDataSource = new TempDataSource({
      ...this.config.typeorm.dataSource.default,
      entities: [],
    });
    // 连接数据库
    await tempDataSource.initialize();
    const { newCode, className, oldTableName } = this.parseCode(entityString);
    const code = ts.transpile(
      `${newCode}
        tempDataSource.options.entities.push(${className})
        `,
      {
        emitDecoratorMetadata: true,
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2018,
        removeComments: true,
        experimentalDecorators: true,
        noImplicitThis: true,
        noUnusedLocals: true,
        stripInternal: true,
        skipLibCheck: true,
        pretty: true,
        declaration: true,
        noImplicitAny: false,
      }
    );
    eval(code);
    await tempDataSource.buildMetadatas();
    const meta = tempDataSource.getMetadata(className);
    const columnArr = meta.columns;
    await tempDataSource.destroy();

    const commColums = [];
    const columns = _.filter(
      columnArr.map(e => {
        return {
          propertyName: e.propertyName,
          type: typeof e.type == 'string' ? e.type : e.type.name.toLowerCase(),
          length: e.length,
          comment: e.comment,
          nullable: e.isNullable,
        };
      }),
      o => {
        if (['createTime', 'updateTime'].includes(o.propertyName)) {
          commColums.push(o);
        }
        return o && !['createTime', 'updateTime'].includes(o.propertyName);
      }
    ).concat(commColums);
    if (!controller) {
      const tableNames = oldTableName.split('_');
      const fileName = tableNames[tableNames.length - 1];
      return {
        columns,
        className: className.replace('TEMP', ''),
        tableName: oldTableName,
        fileName,
        path: `/admin/${module}/${fileName}`,
      };
    }
    const fileName = await this.fileName(controller);
    return {
      columns,
      path: `/admin/${module}/${fileName}`,
    };
  }

  /**
   * 解析Entity类名
   * @param code
   * @returns
   */
  parseCode(code: string) {
    try {
      const oldClassName = code
        .match('class(.*)extends')[1]
        .replace(/\s*/g, '');
      const oldTableStart = code.indexOf('@Entity(');
      const oldTableEnd = code.indexOf(')');

      const oldTableName = code
        .substring(oldTableStart + 9, oldTableEnd - 1)
        .replace(/\s*/g, '')
        // eslint-disable-next-line no-useless-escape
        .replace(/\"/g, '')
        // eslint-disable-next-line no-useless-escape
        .replace(/\'/g, '');
      const className = `${oldClassName}TEMP`;
      return {
        newCode: code
          .replace(oldClassName, className)
          .replace(oldTableName, `func_${oldTableName}`),
        className,
        tableName: `func_${oldTableName}`,
        oldTableName,
      };
    } catch (err) {
      throw new CoolCommException('代码结构不正确，请检查');
    }
  }

  /**
   *  创建代码
   * @param body body
   */
  async create(body) {
    const { module, entity, controller, fileName } = body;
    const basePath = this.app.getBaseDir();
    // const fileName = await this.fileName(controller);
    // 生成Entity
    const entityPath = pathUtil.join(
      basePath,
      'modules',
      module,
      'entity',
      `${fileName}.ts`
    );
    // 生成Controller
    const controllerPath = pathUtil.join(
      basePath,
      'modules',
      module,
      'controller',
      'admin',
      `${fileName}.ts`
    );
    this.createConfigFile(module);
    this.createFile(entityPath, entity);
    this.createFile(controllerPath, controller);
  }

  /**
   * 创建配置文件
   * @param module
   */
  async createConfigFile(module: string) {
    const basePath = this.app.getBaseDir();
    const configFilePath = pathUtil.join(
      basePath,
      'modules',
      module,
      'config.ts'
    );
    if (!fs.existsSync(configFilePath)) {
      const data = `import { ModuleConfig } from '@cool-midway/core';

/**
 * 模块配置
 */
export default () => {
  return {
    // 模块名称
    name: 'xxx',
    // 模块描述
    description: 'xxx',
    // 中间件，只对本模块有效
    middlewares: [],
    // 中间件，全局有效
    globalMiddlewares: [],
    // 模块加载顺序，默认为0，值越大越优先加载
    order: 0,
  } as ModuleConfig;
};
`;
      await this.createFile(configFilePath, data);
    }
  }

  /**
   * 找到文件名
   * @param controller
   * @returns
   */
  async fileName(controller: string) {
    const regex = /import\s*{\s*\w+\s*}\s*from\s*'[^']*\/([\w-]+)';/;
    const match = regex.exec(controller);

    if (match && match.length > 1) {
      return match[1];
    }

    return null;
  }

  /**
   * 创建文件
   * @param filePath
   * @param content
   */
  async createFile(filePath: string, content: string) {
    const folderPath = pathUtil.dirname(filePath);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    fs.writeFileSync(filePath, content);
  }

  /**
   * 导出菜单
   * @param ids
   * @returns
   */
  async export(ids: number[]) {
    const result: any[] = [];
    const menus = await this.baseSysMenuEntity.findBy({ id: In(ids) });

    // 递归取出子菜单
    const getChildMenus = (parentId: number): any[] => {
      const children = _.remove(menus, e => e.parentId == parentId);
      children.forEach(child => {
        child.childMenus = getChildMenus(child.id);
        // 删除不需要的字段
        delete child.id;
        delete child.createTime;
        delete child.updateTime;
        delete child.parentId;
      });
      return children;
    };

    // lodash取出父级菜单(parentId为 null)， 并从menus 删除
    const parentMenus = _.remove(menus, e => {
      return e.parentId == null;
    });

    // 对于每个父级菜单，获取它的子菜单
    parentMenus.forEach(parent => {
      parent.childMenus = getChildMenus(parent.id);
      // 删除不需要的字段
      delete parent.id;
      delete parent.createTime;
      delete parent.updateTime;
      delete parent.parentId;

      result.push(parent);
    });

    return result;
  }

  /**
   * 导入
   * @param menus
   */
  async import(menus: any[]) {
    // 递归保存子菜单
    const saveChildMenus = async (parentMenu: any, parentId: number | null) => {
      const children = parentMenu.childMenus || [];
      for (let child of children) {
        const childData = { ...child, parentId: parentId }; // 保持与数据库的parentId字段的一致性
        delete childData.childMenus; // 删除childMenus属性，因为我们不想将它保存到数据库中

        // 保存子菜单并获取其ID，以便为其子菜单设置parentId
        const savedChild = await this.baseSysMenuEntity.save(childData);

        if (!_.isEmpty(child.childMenus)) {
          await saveChildMenus(child, savedChild.id);
        }
      }
    };

    for (let menu of menus) {
      const menuData = { ...menu };
      delete menuData.childMenus; // 删除childMenus属性，因为我们不想将它保存到数据库中

      // 保存主菜单并获取其ID
      const savedMenu = await this.baseSysMenuEntity.save(menuData);

      if (menu.childMenus && menu.childMenus.length > 0) {
        await saveChildMenus(menu, savedMenu.id);
      }
    }
  }
}
