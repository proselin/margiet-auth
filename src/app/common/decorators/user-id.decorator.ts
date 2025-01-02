import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IInternalRequest } from '../types';

export const UserId = createParamDecorator((_, ctx: ExecutionContext) => {
  const request: IInternalRequest = ctx.switchToHttp().getRequest();
  return request.userId;
});
