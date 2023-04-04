export { CoolEsConfiguration as Configuration } from './configuration';

export * from './elasticsearch';

export * from './decorator/elasticsearch';

export * from './base';

export interface ICoolEs {
  indexInfo(): Object;
}

export interface CoolEsConfig {
  nodes: string[];
}
