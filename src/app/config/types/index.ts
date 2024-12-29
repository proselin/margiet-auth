import { NodeEnv } from '../../common/enums';

export interface IConfiguration {
  environment: NodeEnv;
  isProduction: boolean;
  isDevelopment: boolean;
  isTesting: boolean;
  swagger: {
    enable: boolean;
    path: string;
  };
  app: {
    host: string;
    port: number;
    apiPrefix: string;
  };
  redis: {
    host: string;
    port: number;
    username?: string;
    password?: string;
  };
  database: {
    username?: string;
    password?: string;
    name: string;
    uri: string;
  };
  jwt: {
    secretPath: string;
    secret: string;
    expirationTime: string;
    publicKeyPath: string;
    privateKeyPath: string;
    publicKey: string;
    privateKey: string;
  };
  cache: {
    ttl: number;
    max: number;
    refreshThreshold: number;
  };
}
