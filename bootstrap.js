const { Bootstrap } = require('@midwayjs/bootstrap');

// 内存监控代码
setInterval(() => {
  const memoryUsage = process.memoryUsage();
  console.log('内存使用情况:');
  console.log(
    '堆内存总量:',
    Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB'
  );
  console.log(
    '堆内存使用量:',
    Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB'
  );
  console.log(
    '外部内存使用量:',
    Math.round(memoryUsage.external / 1024 / 1024) + 'MB'
  );
  console.log(
    'RSS (常驻集大小):',
    Math.round(memoryUsage.rss / 1024 / 1024) + 'MB'
  );
  console.log('-----------------------------------');
}, 5000); // 每5秒检查一次

// 全局错误处理 - 在应用启动前设置
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的 Promise Rejection:', reason);
  // 如果是数据库连接错误，不退出进程
  if (
    reason &&
    (reason.code === 'ER_NET_READ_INTERRUPTED' || reason.code === 'ETIMEDOUT')
  ) {
    console.error('数据库连接错误，应用将继续运行:', {
      code: reason.code,
      errno: reason.errno,
      sqlState: reason.sqlState,
      sqlMessage: reason.sqlMessage,
    });
    return;
  }
  // 如果是Redis只读错误，不退出进程
  if (reason && reason.message && reason.message.includes('READONLY')) {
    console.warn('Redis只读副本错误，应用将继续运行:', {
      message: reason.message,
      command: reason.command,
    });
    return;
  }
  // 其他错误记录但不退出
  console.error('Promise Rejection 详情:', {
    reason: reason?.message || reason,
    stack: reason?.stack,
  });
});

process.on('uncaughtException', error => {
  console.error('未捕获的异常:', error);
  // 对于数据库连接错误，不退出进程
  if (
    error.message?.includes('timeout') ||
    error.message?.includes('ETIMEDOUT') ||
    error.message?.includes('ER_NET_READ_INTERRUPTED')
  ) {
    console.warn('数据库连接超时，应用将继续运行');
    return;
  }
  // 对于Redis只读错误，不退出进程
  if (error.message?.includes('READONLY')) {
    console.warn('Redis只读副本错误，应用将继续运行');
    return;
  }
  // 其他严重错误，记录后退出
  console.error('严重错误，进程将退出');
  process.exit(1);
});

// 显式以组件方式引入用户代码
Bootstrap.configure({
  // 这里引用的是编译后的入口，本地开发不走这个文件
  // eslint-disable-next-line node/no-unpublished-require
  imports: require('./dist/index'),
  // 禁用依赖注入的目录扫描
  moduleDetector: false,
}).run();
