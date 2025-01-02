import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export class JwtConfig {
  static register() {
    return JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: async (configService: ConfigService) => {
        return {
          global: true,
          verifyOptions: {
            algorithms: ['RS256'],
            audience: new RegExp(configService.get<string>('jwt.audience')),
            issuer: configService.get<string>('jwt.issuer'),
          },
          signOptions: {
            algorithm: 'RS256',
            issuer: configService.get<string>('jwt.issuer'),
            audience: configService.get<string>('jwt.audience'),
            expiresIn: configService.get<string>('jwt.expirationTime'),
            mutatePayload: false,
          },
        } satisfies JwtModuleOptions;
      },
    });
  }
}
