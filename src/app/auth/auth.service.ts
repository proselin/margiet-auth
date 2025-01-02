import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger, Res,
  UnauthorizedException
} from '@nestjs/common';
import { MaJwtService } from '../ma-jwt';
import { IInternalResponse } from '../common/types/internal-response.type';
import { ConfigService } from '@nestjs/config';
import { ICookieConfiguration } from '../config/types';
import { TokenType } from '../ma-jwt/constant/token-type';
import ms from 'ms';
import {
  differenceInDays,
  differenceInHours,
  differenceInMonths,
  getUnixTime,
} from 'date-fns';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { eq, isNil } from 'lodash';
import { User } from '../user/entities';
import { isEmail } from 'class-validator';
import { SLUG_REGEX } from '../common/constant/regex';
import { ICredentials } from '../user/types';
import { compare } from 'bcrypt';
import { SignInDto } from './dtos/sign-in.dto';
import { IAuthResult } from './types/auth-result.type';
import { UserService } from '../user';
import { v4 } from 'uuid';

import { SignUpDto } from './dtos/sign-up.dto';
import {
  EmailIsUsedException,
  PasswordIsNotMatchException,
  UserNotConfirmedException,
} from './exeptions';

interface IAuthService {
  /**
   * Sign In
   *
   * check to user account with password and username or email
   * and return access token for user
   */
  signIn(dto: SignInDto, domain: string): Promise<IAuthResult>;
  signUp(dto: SignUpDto, domain: string): void;
  confirmEmail(): void;
  refreshAccessToken(): void;
  resetPassword(): void;
  updatePassword(): void;
}

@Injectable()
export class AuthService implements IAuthService {
  /**
   * =========================================
   *                  VARIABLES
   * =========================================
   */
  private readonly COOKIE_PATH = '/api/v1/auth';
  private readonly refreshTime: string;
  private readonly cookieConfig: ICookieConfiguration;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: MaJwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache
  ) {
    this.refreshTime = this.configService.get<string>(
      `jwt.${TokenType.REFRESH}.time`
    );
    this.cookieConfig = this.configService.get<ICookieConfiguration>('cookie');
  }

  async signIn(
    dto: SignInDto,
    domain?: string,
    response?: IInternalResponse
  ) {
    const { emailOrUsername, password } = dto;
    const user = await this.getUserByUserNameOrEmail(emailOrUsername);

    if (!user || !(await compare(password, user.password))) {
      throw new BadRequestException("Wrong user or password !");
    }
    //TODO Send a mail;
    this.checkUserIsConfirmed(user);

    const [accessToken, refreshToken] =
      await this.jwtService.generateAuthTokens(user, v4(), domain);

    this.saveRefreshCookie(response, refreshToken);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.jwtService.accessTokenTime,
      refreshExpiresIn: this.jwtService.refreshTokenTime,
    } satisfies IAuthResult;
  }

  async signUp(dto: SignUpDto) {
    const isExistedEmail = await this.userService.existedEmail(dto.email);

    if (isExistedEmail) {
      throw new EmailIsUsedException();
    }

    if (!this.passwordsAreEqual(dto.password1, dto.password2)) {
      throw new PasswordIsNotMatchException();
    }

    await this.userService.createNewUser(dto.email, dto.name, dto.password1);
  }

  passwordsAreEqual(pass1: string, pass2: string) {
    return eq(pass1, pass2);
  }

  async confirmEmail() {
    void 0;
  }

  async refreshAccessToken() {
    void 0;
  }

  async resetPassword() {
    void 0;
  }

  async updatePassword() {
    void 0;
  }

  private async checkLastPassword(
    credentials: ICredentials,
  ): Promise<void> {
    const {  passwordUpdatedAt } = credentials;

    const now = Date.now();
    const time = getUnixTime(passwordUpdatedAt);
    const months = differenceInMonths(now, time);
    const message = 'You changed your password ';

    if (months > 0) {
      throw new UnauthorizedException(
        message + months + (months > 1 ? ' months ago' : ' month ago')
      );
    }

    const days = differenceInDays(now, time);

    if (days > 0) {
      throw new UnauthorizedException(
        message + days + (days > 1 ? ' days ago' : ' day ago')
      );
    }

    const hours = differenceInHours(now, time);

    if (hours > 0) {
      throw new UnauthorizedException(
        message + hours + (hours > 1 ? ' hours ago' : ' hour ago')
      );
    }

    throw new UnauthorizedException(message + 'recently');
  }

  public saveRefreshCookie(
    res: IInternalResponse,
    refreshToken: string
  ): IInternalResponse {
    return res
      .cookie(this.cookieConfig.refreshCookieName, refreshToken, {
        secure: true,
        httpOnly: true,
        signed: true,
        path: this.COOKIE_PATH,
        expires: new Date(Date.now() + ms(this.refreshTime) * 1000),
      })
  }

  private async blacklistToken(
    userId: number,
    tokenId: string,
    exp: number
  ): Promise<void> {
    const now = getUnixTime(new Date());
    const ttl = (exp - now) * 1000;
    try {
      if (ttl > 0) {
        await this.cacheManager.set(`blacklist:${userId}:${tokenId}`, now, ttl);
      }
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Set Black list for token error');
    }
  }

  private async checkIfTokenIsBlacklisted(
    userId: number,
    tokenId: string
  ): Promise<void> {
    const time = await this.cacheManager.get<number>(
      `blacklist:${userId}:${tokenId}`
    );

    if (!isNil(time)) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private comparePasswords(password1: string, password2: string): void {
    if (password1 !== password2) {
      throw new BadRequestException('Passwords do not match');
    }
  }

  private async getUserByUserNameOrEmail(
    emailOrUsername: string
  ): Promise<User | undefined> {
    if (emailOrUsername.includes('@')) {
      this.logger.log('User are signIn with email');
      if (!isEmail(emailOrUsername)) {
        throw new BadRequestException('Invalid email');
      }
      return this.userService.findUserByEmail(emailOrUsername);
    }

    if (
      emailOrUsername.length < 3 ||
      emailOrUsername.length > 106 ||
      !SLUG_REGEX.test(emailOrUsername)
    ) {
      throw new BadRequestException('Invalid username');
    }

    return this.userService.findUserByUsername(emailOrUsername);
  }

  private checkUserIsConfirmed(user: User): void {
    if (user.confirmed) return;
    //TODO Check to resend email
    throw new UserNotConfirmedException();
  }
}
