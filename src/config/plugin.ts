import { EggPlugin } from 'egg';
export default {
  static: true, // default is true
  view: true,
  schedule: true,
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
  bcrypt: {
    enable: true,
    package: 'egg-bcrypt'
  },
} as EggPlugin;
