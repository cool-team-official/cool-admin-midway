import { createLightApp } from '@midwayjs/mock';
import * as custom from '../src';

describe('/test/index.test.ts', () => {
  it('test component', async () => {
    const app = await createLightApp('', {
      imports: [
        custom
      ]
    });
    const bookService = await app.getApplicationContext().getAsync(custom.BookService);
    expect(await bookService.getBookById()).toEqual('hello world');
  });
});
