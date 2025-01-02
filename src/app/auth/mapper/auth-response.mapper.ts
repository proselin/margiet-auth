import { IAuthResult } from '../types/auth-result.type';
import { plainToInstance } from 'class-transformer';

export class AuthResponseMapper {
  public static map(result: IAuthResult): AuthResponseMapper {
    return plainToInstance(AuthResponseMapper, {
      accessToken: result.accessToken,
      refreshExpiresIn: result.refreshExpiresIn,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
      tokenType: 'Bearer',
    });
  }
}
