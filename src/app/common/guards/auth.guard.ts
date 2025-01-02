import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExtractJwt } from 'passport-jwt';
import { MaJwtService } from '../../ma-jwt';
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator';
import { IInternalRequest } from '../types';
import { TokenType } from '../../ma-jwt/constant/token-type';
import { IAccessToken } from '../../ma-jwt/types';
import { isJWT } from 'class-validator';

@Injectable()
export class AuthGuard implements CanActivate {
  private logger = new Logger(AuthGuard.name);

  constructor(private jwtService: MaJwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.isPublic(context);

    const request = context.switchToHttp().getRequest<IInternalRequest>();
    const token = this.extractToken(request);

    if (!token || !isJWT(token)) {
      if (isPublic) return true;
      throw new UnauthorizedException();
    }

    try {
      const { id } = await this.jwtService.verifyToken<IAccessToken>(
        token,
        TokenType.ACCESS
      );
      request.userId = id;
      return true;
    } catch (e) {
      if (isPublic) return true;
      this.logger.error(e);
      throw new UnauthorizedException();
    }
  }

  private isPublic(context: ExecutionContext) {
    return !!this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private extractToken(request: IInternalRequest) {
    const token = request.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) return null;
    const result = token.split(' ')[1];
    if (!result) return null;
    return result;
  }
}
