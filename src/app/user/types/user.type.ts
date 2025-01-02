import { ICredentials } from './credentials.type';

export interface IUser {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  confirmed: boolean;
  credentials: ICredentials;
  createdAt: Date;
  updatedAt: Date;
}
