const WebFramework = require('@midwayjs/web').Framework;
const web = new WebFramework().configure({
  port: 8001,
});

const { Bootstrap } = require('@midwayjs/bootstrap');
Bootstrap.load(web).run();
