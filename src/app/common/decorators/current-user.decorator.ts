import { IInternalRequest } from '../types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request: IInternalRequest = ctx.switchToHttp().getRequest();
  return request.user;
});