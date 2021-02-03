import { Scope, ScopeEnum, saveClassMetadata, saveModule, CONTROLLER_KEY, MiddlewareParamArray } from '@midwayjs/decorator';

export interface ControllerOption {
  prefix: string;
  routerOptions: {
    sensitive?: boolean;
    middleware?: MiddlewareParamArray;
    alias?: string[];
    description?: string;
    tagName?: string;
  };
}

export function Controller(
  prefix: string,
  routerOptions: {
    sensitive?: boolean;
    middleware?: MiddlewareParamArray;
    description?: string;
    tagName?: string;
  } = { middleware: [], sensitive: true }
): ClassDecorator {
  return (target: any) => {
    saveModule(CONTROLLER_KEY, target);
    console.log(66666666, 'CONTROLLER_KEY', CONTROLLER_KEY)
    saveClassMetadata(
      CONTROLLER_KEY,
      {
        prefix,
        routerOptions,
      } as ControllerOption,
      target
    );
    Scope(ScopeEnum.Request)(target);
  };
}
