import { Request } from 'express';

export interface IInternalRequest extends Request {
  requestId?: string;
  user?: unknown;
}
