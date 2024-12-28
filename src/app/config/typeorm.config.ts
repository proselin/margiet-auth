import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export abstract class TypeormConfig {
  static register() {
    return TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('database.uri'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
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
        autoReconnect: true,
        retryAttempts: 3,
        retryDelay: 5000,
        appname: 'margiet-auth',
        applicationName: 'margiet-auth',
        verboseRetryLog: configService.get<boolean>('isDevelopment'),
        logging: configService.get<boolean>('isDevelopment'),
        synchronize: true,
      }),
    })
  }
}