import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';

import { CacheConfig, Configuration, TypeOrmConfig, WinstonConfig } from './config';
import {
  HelmetMiddleware,
  PassportInitializeMiddleware,
  PassportSessionMiddleware,
  RequestIdMiddleware
} from './common/middlewares';
import { AppController } from './app.controller';
import { JwtConfig } from './config/jwt.config';
import { JwtAdapterModule } from './jwt-adapter';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors';

@Module({
  imports: [
    Configuration.register(),
    TypeOrmConfig.register(),
    CacheConfig.register(),
    WinstonConfig.register(),
    JwtConfig.register(),
    JwtAdapterModule,
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
  controllers: [AppController]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        HelmetMiddleware,
        RequestIdMiddleware,
        PassportInitializeMiddleware,
        PassportSessionMiddleware
      )
      .forRoutes('*');
  }
}
