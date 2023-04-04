/**
 * 异常基类
 */
export class BaseException extends Error {
  status: number;

  constructor(name: string, code: number, message: string) {
    super(message);

    this.name = name;
    this.status = code;
  }
}
