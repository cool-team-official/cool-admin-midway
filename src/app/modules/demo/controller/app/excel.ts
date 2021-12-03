import { Get, Inject, Post, Provide } from '@midwayjs/decorator';
import { CoolController, BaseController } from '@cool-midway/core';
import xlsx from 'node-xlsx';
import { Context } from 'egg';
import * as fs from 'fs';

/**
 * 导入导出
 */
@Provide()
@CoolController()
export class DemoExcelController extends BaseController {
  @Inject()
  ctx: Context;

  /**
   * 导入
   */
  @Post('/import')
  async import() {
    // 读取上传上来的文件
    const file = this.ctx.request.files[0];
    try {
      // 解析文件
      const data = xlsx.parse(file.filepath);
      console.log(data);
    } finally {
      fs.unlinkSync(file.filepath);
    }
    return this.ok();
  }

  /**
   * 导出
   */
  @Get('/export')
  async export() {
    const data = [
      ['姓名', '年龄'],
      ['啊平', 18],
      ['江帅', 19],
    ];
    const buffer = xlsx.build([{ name: '成员', data: data }]);
    const fileName = '导出.xlsx';
    this.ctx.attachment(fileName);
    this.ctx.status = 200;
    this.ctx.body = buffer;
  }
}
