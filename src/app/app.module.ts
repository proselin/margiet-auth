import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';

import {
  CacheConfig,
  Configuration,
  TypeOrmConfig,
  WinstonConfig,
} from './config';
import {
  HelmetMiddleware,
  PassportInitializeMiddleware,
  PassportSessionMiddleware,
  RequestIdMiddleware,
} from './common/middlewares';
import { JwtConfig } from './config/jwt.config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors';
import { AuthModule } from './auth';
import { CookieParserMiddleware } from './common/middlewares/cookie-parser.middleware';
import { UserModule } from './user';

@Module({
  imports: [
    Configuration.register(),
    TypeOrmConfig.register(),
    CacheConfig.register(),
    WinstonConfig.register(),
    JwtConfig.register(),
    UserModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true, whitelist: true }),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        HelmetMiddleware,
        RequestIdMiddleware,
        PassportInitializeMiddleware,
        PassportSessionMiddleware,
        CookieParserMiddleware,
      )
      .forRoutes('*');
  }
}
