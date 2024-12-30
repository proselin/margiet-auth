import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { IInternalRequest } from '../types';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>
  ): Observable<unknown> | Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest() as IInternalRequest;
    const frsys = request?.cookies?.['frsys'] ?? '';
    const handler = context.getHandler().name;
    const type = context.getType();
    const className = context.getClass().name;
    const uuid: string = request.requestId ?? 'no-request-id';
    const prefix = `[${uuid}:${frsys}][${handler}]:[${type}]`;
    Logger.log(
      `${prefix}::Incomming Request \n Params ${JSON.stringify(
        request.params
      )} \n  Body ${JSON.stringify(request.body)} \n`,
      className
    );
    const now = Date.now();
    return next.handle().pipe(
      tap({
        next: () => {
          Logger.log(
            `${prefix}::Complete in ${Date.now() - now} ms`,
            className
          );
        },
        error: (err) => {
          Logger.error(`${prefix}:: Request error`, className);
          Logger.error(err, className);
        },
      })
    );
  }
}
