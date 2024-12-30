import { NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import { v4 } from 'uuid';
import { IInternalRequest } from '../types';

export class RequestIdMiddleware implements NestMiddleware {
  use(request: IInternalRequest, response: Response, next: () => unknown) {
    const requestId = v4();

    //Set requestId to request and response headers
    request.requestId = requestId;
    response.setHeader('X-Request-Id', requestId);
    next();
  }
}
