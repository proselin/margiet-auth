import { IEmailPayload } from './email-token.type';
import { ITokenBase } from './token-base.type';

export interface IRefreshPayload extends IEmailPayload {
  tokenId: string;
}

export interface IRefreshToken extends IRefreshPayload, ITokenBase {}
