import { ExecutionContext } from '@nestjs/common';
import { IInternalRequest } from '../types';

export const FromRequest = (property: string, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<IInternalRequest>();
  return request[property];
};