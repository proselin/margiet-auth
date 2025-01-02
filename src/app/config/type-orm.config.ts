import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export abstract class TypeOrmConfig {
  static register() {
    return TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          url: configService.get<string>('database.uri'),
          entities: [__dirname + '/**/*.entity.{js,ts}'],
          cache: {
            type: 'redis',
            options: {
              socket: {
                host: configService.get<string>('redis.host'),
                port: configService.get<number>('redis.port'),
                username: configService.get<string>('redis.username'),
                password: configService.get<string>('redis.password'),
              },
            },
          },
          username: configService.get('database.username'),
          password: configService.get('database.password'),
          database: configService.get('database.name'),
          retryAttempts: 3,
          retryDelay: 5000,
          applicationName: 'margiet-auth',
          verboseRetryLog: configService.get<boolean>('isDevelopment'),
          logging: configService.get<boolean>('isDevelopment'),
          synchronize: configService.get<boolean>('isDevelopment'),
          autoLoadEntities: true
        } satisfies TypeOrmModuleOptions;
      },
    });
  }
}
