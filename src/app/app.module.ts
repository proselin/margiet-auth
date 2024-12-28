import { Module } from '@nestjs/common';
import {
  CacheConfig,
  Configuration,
  TypeormConfig,
  WinstonConfig,
} from './config';

@Module({
  imports: [
    Configuration.register(),
    TypeormConfig.register(),
    CacheConfig.register(),
    WinstonConfig.register(),
  ],
})
export class AppModule {}
