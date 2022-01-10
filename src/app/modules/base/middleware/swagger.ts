import { Provide } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayWebNext } from '@midwayjs/web';
import { Context } from 'egg';
import * as _ from 'lodash';

/**
 * swagger
 */
@Provide()
export class BaseSwaggerMiddleware implements IWebMiddleware {
  resolve() {
    return async (ctx: Context, next: IMidwayWebNext) => {
      const { url } = ctx;
      await next();
      if (_.startsWith(url, '/swagger-ui/json')) {
        ctx.body.components.securitySchemes = {
          Authorization: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
          },
        };
        ctx.body.security = [{ Authorization: [] }];
      }
    };
  }
}
