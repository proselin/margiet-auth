import { z } from 'zod';
import { NodeEnv } from '../common/enums';
import { defaultVariables } from '../common/constant/app';
import * as fs from 'node:fs';
import { ConfigModule } from '@nestjs/config';

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
      HOST: z.string().default(defaultVariables.host),
      PORT: z.coerce.number().default(defaultVariables.port),
      API_PREFIX: z.string().default(defaultVariables.apiPrefix),
      APP_ID: z.string().uuid().default(defaultVariables.appId),
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
      DATABASE_USERNAME: z.string().optional(),
      DATABASE_PASSWORD: z.string().optional(),
      DATABASE_NAME: z
        .string()
        .optional()
        .default(defaultVariables.database.name),
      DATABASE_URI: z.string().default(defaultVariables.database.uri),
    };

    const jwtConfig = {
      JWT_SECRET_PATH: z.string(),
      JWT_EXPIRATION_TIME: z.string(),
      JWT_PUBLIC_KEY_PATH: z.string(),
      JWT_PRIVATE_KEY_PATH: z.string(),
    };

    const cacheConfig = {
      CACHE_TTL: z.coerce.number().default(defaultVariables.cache.ttl),
      CACHE_REFRESH_THRESHOLD: z.coerce
        .number()
        .default(defaultVariables.cache.refreshThreshold),
      CACHE_MAX: z.coerce.number().default(defaultVariables.cache.max),
    };

    const schema = z.object({
      NODE_ENV,
      ...appConfig,
      ...databaseConfig,
      ...redisConfig,
      ...swaggerConfig,
      ...jwtConfig,
      ...cacheConfig,
    });

    return schema.parse(config);
  }

  public static parseEnv(
    config: Record<string, unknown>
  ): Record<string, unknown> {
    return {
      environment: config.NODE_ENV,
      isProduction: config.NODE_ENV === NodeEnv.Production,
      isDevelopment: config.NODE_ENV === NodeEnv.Development,
      isTesting: config.NODE_ENV === NodeEnv.Test,

      swagger: {
        enable: config.SWAGGER_ENABLE,
        path: config.SWAGGER_PATH,
      },

      app: {
        host: config.HOST,
        port: config.PORT,
        apiPrefix: config.API_PREFIX,
      },

      redis: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        username: config.REDIS_USERNAME,
        password: config.REDIS_PASSWORD,
      },

      database: {
        username: config.DATABASE_USERNAME,
        password: config.DATABASE_PASSWORD,
        name: config.DATABASE_NAME,
        uri: config.DATABASE_URI,
      },

      jwt: {
        secretPath: config.JWT_SECRET_PATH,
        secret: fs.readFileSync(<string>config.JWT_SECRET_PATH, 'utf8'),
        expirationTime: config.JWT_EXPIRATION_TIME,
        publicKeyPath: config.JWT_PUBLIC_KEY_PATH,
        privateKeyPath: config.JWT_PRIVATE_KEY_PATH,
        publicKey: fs.readFileSync(<string>config.JWT_PUBLIC_KEY_PATH, 'utf8'),
        privateKey: fs.readFileSync(
          <string>config.JWT_PRIVATE_KEY_PATH,
          'utf8'
        ),
      },

      cache: {
        ttl: config.CACHE_TTL,
        max: config.CACHE_MAX,
        refreshThreshold: config.CACHE_REFRESH_THRESHOLD,
      },
    };
  }

  public static register() {
    return ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        return Configuration.parseEnv(Configuration.validatingSchema(config));
      },
    });
  }
}