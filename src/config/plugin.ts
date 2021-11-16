import { EggPlugin } from 'egg';
export default {
  static: true, // default is true
  view: true,
  schedule: true,
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
  logrotator: false, // disable when use @midwayjs/logger
} as EggPlugin;
