import { CacheManagerOptions, CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';

export abstract class CacheConfig {
  static register() {
    return CacheModule.registerAsync({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (config: ConfigService) => {
        const keyv = new Keyv(
          new KeyvRedis({
            url: `redis://${config.get('redis.host')}:${config.get(
              'redis.port'
            )}`,
            username: config.get<string>('redis.username'),
            password: config.get<string>('redis.password'),
          })
        );
        return {
          refreshThreshold: config.get<number>('cache.refreshThreshold'),
          max: config.get<number>('cache.max'),
          store: keyv.store,
          ttl: config.get<number>('cache.ttl'),
        } satisfies CacheManagerOptions;
      },
    });
  }
}
