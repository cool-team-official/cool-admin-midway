import { EggPlugin } from 'egg';
export default {
  static: true, // default is true
  view: false,
  schedule: true,
  logrotator: false, // disable when use @midwayjs/logger
} as EggPlugin;
