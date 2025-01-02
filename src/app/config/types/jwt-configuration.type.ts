import { TokenType } from '../../ma-jwt/constant/token-type';

export interface IJwtConfiguration {
  issuer: string;
  audience: string;
  secret: string;
  expirationTime: string;

  [TokenType.ACCESS]: {
    publicKey: string | Buffer;
    privateKey: string | Buffer;
    time: string;
  };
  [TokenType.REFRESH]: {
    secret: string;
    time: string;
  };
  [TokenType.CONFIRMATION]: {
    secret: string;
    time: string;
  };
  [TokenType.RESET_PASSWORD]: {
    secret: string;
    time: string;
  };
}
