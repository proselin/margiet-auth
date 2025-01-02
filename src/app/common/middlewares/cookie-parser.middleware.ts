import { Inject, NestMiddleware } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

export class CookieParserMiddleware implements NestMiddleware {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService
  ) {}

  use = cookieParser(this.configService.get<string>('cookie.secret'));
}
