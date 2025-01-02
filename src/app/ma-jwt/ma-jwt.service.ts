import { Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenType } from './constant/token-type';
import { IUser } from '../user/types';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';
import { IJwtConfiguration } from '../config/types';
import { IAccessToken, IEmailToken, IRefreshToken } from './types';
import ms from 'ms';

export interface IMaJwtService {
  generateToken(
    tokenType: TokenType,
    user: Pick<IUser, 'id' | 'credentials' | 'email'>,
    options: {
      domain?: string;
      tokenId?: string;
    }
  ): Promise<string>;

  generateAuthTokens(
    user: Pick<IUser, 'id' | 'credentials' | 'email'>,
    domain?: string,
    tokenId?: string
  ): Promise<[string, string]>;

  verifyToken<T extends IAccessToken | IRefreshToken | IEmailToken>(
    token: string,
    tokenType: TokenType
  ): Promise<T>;
}

@Injectable()
export class MaJwtService implements IMaJwtService, OnModuleInit {
  private jwtConfiguration: IJwtConfiguration;
  private accessTokenConfig: IJwtConfiguration[TokenType.ACCESS];
  private refreshTokenConfig: IJwtConfiguration[TokenType.REFRESH];
  private confirmationTokenConfig: IJwtConfiguration[TokenType.CONFIRMATION];
  private resetPasswordTokenConfig: IJwtConfiguration[TokenType.RESET_PASSWORD];

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService
  ) {}

  onModuleInit() {
    this.jwtConfiguration = this.configService.get<IJwtConfiguration>('jwt');
    this.accessTokenConfig = this.jwtConfiguration[TokenType.ACCESS];
    this.refreshTokenConfig = this.jwtConfiguration[TokenType.REFRESH];
    this.confirmationTokenConfig =
      this.jwtConfiguration[TokenType.CONFIRMATION];
    this.resetPasswordTokenConfig =
      this.jwtConfiguration[TokenType.RESET_PASSWORD];
  }

  public get accessTokenTime() {
    return ms(this.accessTokenConfig.time);
  }

  public get refreshTokenTime() {
    return ms(this.refreshTokenConfig.time);
  }

  public async generateAuthTokens(
    user: IUser,
    domain: string,
    tokenId: string = v4()
  ): Promise<[string, string]> {
    return await Promise.all([
      this.generateAccessToken(user, tokenId, domain),
      this.generateRefreshToken(user, tokenId, domain),
    ]);
  }

  public async generateToken(
    tokenType: TokenType,
    user: Pick<IUser, 'id' | 'credentials' | 'email'>,
    options: {
      domain?: string;
      tokenId?: string;
    }
  ) {
    options.tokenId ??= v4();

    switch (tokenType) {
      case TokenType.ACCESS:
        return this.generateAccessToken(user, options.domain);
      case TokenType.REFRESH:
        return this.generateRefreshToken(user, options.domain, options.tokenId);
      case TokenType.CONFIRMATION:
        return this.generateConfirmToken(user);
      case TokenType.RESET_PASSWORD:
        return this.generateResetPasswordToken(user);
      default:
        throw new Error('Not Found TYPE TOKEN');
    }
  }

  public async verifyToken<
    T extends IAccessToken | IRefreshToken | IEmailToken
  >(token: string, tokenType: TokenType): Promise<T> {
    switch (tokenType) {
      case TokenType.ACCESS: {
        const config = this.jwtConfiguration[tokenType];
        return this.jwtService.verifyAsync(token, {
          publicKey: config.publicKey,
          maxAge: config.time,
        });
      }
      case TokenType.REFRESH:
      case TokenType.CONFIRMATION:
      case TokenType.RESET_PASSWORD: {
        const config = this.jwtConfiguration[tokenType];
        return this.jwtService.verifyAsync(token, {
          secret: config.secret,
          maxAge: config.time,
        });
      }
    }
  }

  private async generateAccessToken(
    user: Pick<IUser, 'id' | 'email'>,
    tokenId: string,
    domain?: string
  ) {
    return this.jwtService.sign(
      { id: user.id, tokenId },
      {
        algorithm: 'RS256',
        privateKey: this.accessTokenConfig.privateKey,
        expiresIn: this.accessTokenConfig.time,
        subject: user.email,
      }
    );
  }

  private async generateRefreshToken(
    user: Pick<IUser, 'id' | 'credentials' | 'email'>,
    tokenId: string,
    domain?: string
  ) {
    return this.jwtService.signAsync(
      {
        id: user.id,
        version: user.credentials.version,
        tokenId,
      },
      {
        algorithm: 'HS256',
        expiresIn: this.refreshTokenConfig.time,
        secret: this.refreshTokenConfig.secret,
        subject: user.email,
      }
    );
  }

  private async generateConfirmToken(
    user: Pick<IUser, 'id' | 'email' | 'credentials'>
  ) {
    return this.jwtService.signAsync(
      {
        id: user.id,
        version: user.credentials.version,
      },
      {
        expiresIn: this.confirmationTokenConfig.time,
        secret: this.confirmationTokenConfig.secret,
        subject: user.email,
      }
    );
  }

  private async generateResetPasswordToken(
    user: Pick<IUser, 'id' | 'email' | 'credentials'>
  ) {
    return this.jwtService.signAsync(
      {
        id: user.id,
        version: user.credentials.version,
      },
      {
        expiresIn: this.resetPasswordTokenConfig.time,
        secret: this.resetPasswordTokenConfig.secret,
        subject: user.email,
      }
    );
  }
}
