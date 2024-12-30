import { ITokenBase } from './token-base.type';

export interface IAccessPayload {
  id: number;
}

export interface IAccessToken extends IAccessPayload, ITokenBase {}
