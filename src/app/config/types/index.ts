import { NodeEnv } from '../../common/enums';
import { IAppConfiguration } from './app-configuration.type';
import { IRedisConfiguration } from './redis-configuration.type';
import { IDataBaseConfiguration } from './database-configuration.type';
import { IJwtConfiguration } from './jwt-configuration.type';
import { ICacheConfiguration } from './cache-configuration.type';
import { ISwaggerConfiguration } from './swagger-configuration.type';
import { ICookieConfiguration } from './cookie-configuration.type';

export interface IConfiguration {
  environment: NodeEnv;
  isProduction: boolean;
  isDevelopment: boolean;
  isTesting: boolean;

  app: IAppConfiguration;
  swagger: ISwaggerConfiguration;
  redis: IRedisConfiguration;
  database: IDataBaseConfiguration;
  jwt: IJwtConfiguration;
  cache: ICacheConfiguration;
  cookie: ICookieConfiguration;
}

export { ICookieConfiguration } from './cookie-configuration.type';
export { IAppConfiguration } from './app-configuration.type';
export { IRedisConfiguration } from './redis-configuration.type';
export { IDataBaseConfiguration } from './database-configuration.type';
export { IJwtConfiguration } from './jwt-configuration.type';
export { ICacheConfiguration } from './cache-configuration.type';
export { ISwaggerConfiguration } from './swagger-configuration.type';
