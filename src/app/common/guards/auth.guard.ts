import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAdapterService } from '../../jwt-adapter';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator';
import { IInternalRequest } from '../types';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  private logger = new Logger(AuthGuard.name);

  constructor(
    private jwtService: JwtAdapterService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublic(context)) return true;

    const request: IInternalRequest = context.switchToHttp().getRequest();
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      request.user = await this.jwtService.origin.verifyAsync(token);
    } catch (e) {
      this.logger.error(e);
      throw new UnauthorizedException();
    }

    return true;
  }

  private isPublic(context: ExecutionContext) {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
