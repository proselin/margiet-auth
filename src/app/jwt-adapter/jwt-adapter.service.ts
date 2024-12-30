import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenType } from './constant/token-type';

@Injectable()
export class JwtAdapterService {
  constructor(private readonly _jwtService: JwtService) {}

  get origin() {
    return this._jwtService;
  }

  public async generateToken(tokenType: TokenType) {
    switch (tokenType) {
      case TokenType.ACCESS:
        break;
      case TokenType.REFRESH:
        break;
      case TokenType.CONFIRMATION:
        break;
      case TokenType.RESET_PASSWORD:
        break;
    }
  }
}
