import { z } from 'zod';
import { NodeEnv } from '../common/enums';
import { defaultVariables } from '../common/constant/app';
import * as fs from 'node:fs';
import { ConfigModule } from '@nestjs/config';
import { IConfiguration } from './types';
import { TokenType } from '../ma-jwt/constant/token-type';

export abstract class Configuration {
  public static validatingSchema(
    config: Record<string, unknown>
  ): Record<string, unknown> {
    const NODE_ENV = z.enum([
      NodeEnv.Development,
      NodeEnv.Production,
      NodeEnv.Test,
    ]);

    const appConfig = {
      HOST: z.string().default(defaultVariables.app.host),
      PORT: z.coerce.number().default(defaultVariables.app.port),
      API_PREFIX: z.string().default(defaultVariables.app.apiPrefix),
      APP_ID: z.string().uuid().default(defaultVariables.app.appId),
      DOMAIN: z.string().default(defaultVariables.app.domain),
    };

    const swaggerConfig = {
      SWAGGER_ENABLE: z.coerce
        .boolean()
        .default(defaultVariables.swagger.enable),
      SWAGGER_PATH: z.string().default(defaultVariables.swagger.path),
    };

    const redisConfig = {
      REDIS_HOST: z.string().default(defaultVariables.redis.host),
      REDIS_PORT: z.coerce.number().default(defaultVariables.redis.port),
      REDIS_USERNAME: z.string().optional(),
      REDIS_PASSWORD: z.string().optional(),
    };

    const databaseConfig = {
      DATABASE_URI: z.string().default(defaultVariables.database.uri),
    };

    const jwtConfig = {
      JWT_SECRET_PATH: z.string(),
      JWT_EXPIRATION_TIME: z.string(),
      JWT_ISSUER: z
        .string()
        .default(process.env.APP_ID)
        .describe('Take APP_ID if no provide JWT_ISSUER'),

      //AccessToken config
      JWT_ACCESS_TOKEN_PUBLIC_KEY_PATH: z.string(),
      JWT_ACCESS_TOKEN_PRIVATE_KEY_PATH: z.string(),
      JWT_ACCESS_TOKEN_EXPIRATION_TIME: z
        .string()
        .default(process.env.JWT_EXPIRATION_TIME),

      // Refresh token
      JWT_REFRESH_TOKEN_SECRET_PATH: z
        .string()
        .default(process.env.JWT_SECRET_PATH),
      JWT_REFRESH_TOKEN_EXPIRATION_TIME: z
        .string()
        .default(process.env.JWT_EXPIRATION_TIME),

      //Confirmation
      JWT_CONFIRMATION_TOKEN_SECRET_PATH: z
        .string()
        .default(process.env.JWT_SECRET_PATH),
      JWT_CONFIRMATION_TOKEN_EXPIRATION_TIME: z
        .string()
        .default(process.env.JWT_EXPIRATION_TIME),

      //ResetPassword
      JWT_RESET_PASSWORD_TOKEN_SECRET_PATH: z
        .string()
        .default(process.env.JWT_SECRET_PATH),
      JWT_RESET_PASSWORD_TOKEN_EXPIRATION_TIME: z
        .string()
        .default(process.env.JWT_EXPIRATION_TIME),
    };

    const cacheConfig = {
      CACHE_TTL: z.coerce.number().default(defaultVariables.cache.ttl),
      CACHE_REFRESH_THRESHOLD: z.coerce
        .number()
        .default(defaultVariables.cache.refreshThreshold),
      CACHE_MAX: z.coerce.number().default(defaultVariables.cache.max),
    };

    const cookieConfig = {
      REFRESH_COOKIE_NAME: z.string(),
      COOKIE_SECRET_PATH: z.string(),
    };

    const schema = z.object({
      NODE_ENV,
      ...appConfig,
      ...databaseConfig,
      ...redisConfig,
      ...swaggerConfig,
      ...jwtConfig,
      ...cacheConfig,
      ...cookieConfig,
    });

    return Object.seal(schema.parse(config));
  }

  public static parseEnv(config: Record<string, unknown>): IConfiguration {
    return Object.freeze({
      environment: <NodeEnv>config.NODE_ENV,
      isProduction: config.NODE_ENV === NodeEnv.Production,
      isDevelopment: config.NODE_ENV === NodeEnv.Development,
      isTesting: config.NODE_ENV === NodeEnv.Test,

      swagger: {
        enable: <boolean>config.SWAGGER_ENABLE,
        path: <string>config.SWAGGER_PATH,
        scalarPath: '/reference'
      },

      app: {
        name: 'MargietAuth',
        host: <string>config.HOST,
        port: <number>config.PORT,
        apiPrefix: <string>config.API_PREFIX,
        domain: <string>config.DOMAIN,
      },

      redis: {
        host: <string>config.REDIS_HOST,
        port: <number>config.REDIS_PORT,
        username: <string>config.REDIS_USERNAME,
        password: <string>config.REDIS_PASSWORD,
      },

      database: {
        uri: <string>config.DATABASE_URI,
      },

      jwt: {
        secret: fs.readFileSync(<string>config.JWT_SECRET_PATH, 'utf8'),
        expirationTime: <string>config.JWT_EXPIRATION_TIME,
        issuer: <string>config.JWT_ISSUER,
        audience: <string>config.DOMAIN,

        [TokenType.ACCESS]: {
          publicKey: fs.readFileSync(
            <string>config.JWT_ACCESS_TOKEN_PUBLIC_KEY_PATH,
            'utf8'
          ),
          privateKey: fs.readFileSync(
            <string>config.JWT_ACCESS_TOKEN_PRIVATE_KEY_PATH,
            'utf8'
          ),
          time: <string>config.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
        },

        [TokenType.REFRESH]: {
          secret: fs.readFileSync(
            <string>config.JWT_REFRESH_TOKEN_SECRET_PATH,
            'utf-8'
          ),
          time: <string>config.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
        },

        [TokenType.CONFIRMATION]: {
          secret: fs.readFileSync(
            <string>config.JWT_CONFIRMATION_TOKEN_SECRET_PATH,
            'utf8'
          ),
          time: <string>config.JWT_CONFIRMATION_TOKEN_EXPIRATION_TIME,
        },

        [TokenType.RESET_PASSWORD]: {
          secret: fs.readFileSync(
            <string>config.JWT_RESET_PASSWORD_TOKEN_SECRET_PATH,
            'utf-8'
          ),
          time: <string>config.JWT_RESET_PASSWORD_TOKEN_EXPIRATION_TIME,
        },
      },

      cookie: {
        refreshCookieName: <string>config.REFRESH_COOKIE_NAME,
        secret: fs.readFileSync(<string>config.COOKIE_SECRET_PATH, 'utf-8'),
      },

      cache: {
        ttl: <number>config.CACHE_TTL,
        max: <number>config.CACHE_MAX,
        refreshThreshold: <number>config.CACHE_REFRESH_THRESHOLD,
      },
    }) satisfies IConfiguration;
  }

  public static register() {
    return ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) =>
        Configuration.parseEnv(Configuration.validatingSchema(config)),
    });
  }
}
