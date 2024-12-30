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
          secret: configService.get<string>('jwt.secret'),
          privateKey: configService.get<string>('jwt.privateKey'),
          publicKey: configService.get<string>('jwt.publicKey'),
          verifyOptions: {
            algorithms: ['RS256'],
            issuer: configService.get<string>('jwt.issuer'),
            maxAge: configService.get<string>('jwt.expirationTime'),
          },
          signOptions: {
            issuer: configService.get<string>('jwt.issuer'),
            expiresIn: configService.get<string>('jwt.expirationTime'),
            mutatePayload: false,
          },
        } satisfies JwtModuleOptions;
      },
    });
  }
}