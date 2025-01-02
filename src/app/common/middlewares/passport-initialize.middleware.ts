import { NestMiddleware } from '@nestjs/common';
import passport from 'passport';

export class PassportInitializeMiddleware implements NestMiddleware {
  use = passport.initialize();
}
