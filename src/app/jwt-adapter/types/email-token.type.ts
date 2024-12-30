import { IAccessPayload } from './access-token.type';
import { ITokenBase } from './token-base.type';

export interface IEmailPayload extends IAccessPayload {
  version: number;
}

export interface IEmailToken extends IEmailPayload, ITokenBase {}
