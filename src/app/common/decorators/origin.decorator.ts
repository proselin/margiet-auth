import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IInternalRequest } from '../types';

export const Origin = createParamDecorator(
  (_, context: ExecutionContext): string | undefined => {
    return context.switchToHttp().getRequest<IInternalRequest>().get('origin');
  }
);
