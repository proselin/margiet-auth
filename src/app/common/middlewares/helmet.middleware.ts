import helmet from 'helmet';
import { NestMiddleware } from '@nestjs/common';

export class HelmetMiddleware implements NestMiddleware {
  use = helmet();
}