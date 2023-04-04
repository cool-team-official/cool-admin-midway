import { Session } from 'inspector';
import { v1 as uuid } from 'uuid';
import * as util from 'util';

/**
 * Location 工具类
 */
class LocationUtil {
  static instance = null;

  session: Session;

  PREFIX = '__functionLocation__';

  scripts = {};

  post$ = null;

  constructor() {
    if (!LocationUtil.instance) {
      this.init();
      LocationUtil.instance = this;
    }
    return LocationUtil.instance;
  }

  init() {
    if (!global[this.PREFIX]) {
      global[this.PREFIX] = {};
    }
    if (this.session) {
      return;
    }
    this.session = new Session();
    this.session.connect();
    this.post$ = util.promisify(this.session.post).bind(this.session);
    this.session.on('Debugger.scriptParsed', res => {
      this.scripts[res.params.scriptId] = res.params;
      LocationUtil.instance = this;
    });
    this.post$('Debugger.enable');
    LocationUtil.instance = this;
  }

  /**
   * 获得脚本位置
   * @param target
   */
  async scriptPath(target: any) {
    const id = uuid();
    global[this.PREFIX][id] = target;
    const evaluated = await this.post$('Runtime.evaluate', {
      expression: `global['${this.PREFIX}']['${id}']`,
      objectGroup: this.PREFIX,
    });
    const properties = await this.post$('Runtime.getProperties', {
      objectId: evaluated.result.objectId,
    });
    const location = properties.internalProperties.find(
      prop => prop.name === '[[FunctionLocation]]'
    );
    const script = this.scripts[location.value.value.scriptId];
    delete global[this.PREFIX][id];
    let source = decodeURI(script.url);
    if (!source.startsWith('file://')) {
      source = `file://${source}`;
    }
    return {
      column: location.value.value.columnNumber + 1,
      line: location.value.value.lineNumber + 1,
      path: source.substr(7),
      source,
    };
  }

  /**
   * 清除
   */
  async clean() {
    if (this.session) {
      await this.post$('Runtime.releaseObjectGroup', {
        objectGroup: this.PREFIX,
      });
      this.session.disconnect();
    }

    this.session = null;
    this.post$ = null;
    this.scripts = null;
    delete global[this.PREFIX];
    LocationUtil.instance = null;
  }
}

export default new LocationUtil();
