import { NestMiddleware } from '@nestjs/common';
import passport from 'passport';

export class PassportSessionMiddleware implements NestMiddleware {
  use = passport.initialize();
}
