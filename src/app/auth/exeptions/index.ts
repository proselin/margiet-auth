import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import {
  ExceptionCode,
  ExceptionsMessage,
} from '../../common/constant/exceptions';

export class UserNotConfirmedException extends UnauthorizedException {
  constructor() {
    super({
      code: ExceptionCode.MA_1,
      message: ExceptionsMessage[ExceptionCode.MA_1],
    });
  }
}

export class EmailIsUsedException extends BadRequestException {
  constructor() {
    super({
      code: ExceptionCode.MA_2,
      message: ExceptionsMessage[ExceptionCode.MA_2],
    });
  }
}

export class PasswordIsNotMatchException extends BadRequestException {
  constructor() {
    super({
      code: ExceptionCode.MA_3,
      message: ExceptionsMessage[ExceptionCode.MA_3],
    });
  }
}
