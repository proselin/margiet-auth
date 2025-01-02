import {
  Body,
  Controller, Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Res,
  Response
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Origin, Public } from '../common/decorators';
import { AuthResponseModel } from './models';
import { ICredentials } from '../user/types';
import { IInternalResponse } from '../common/types/internal-response.type';
import { SignInDto } from './dtos/sign-in.dto';
import { AuthResponseMapper } from './mapper';
import { SignUpDto } from './dtos/sign-up.dto';
import { ResponseModel } from '../common/models';

@Controller()
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/sign-in')
  @ApiOkResponse({
    type: AuthResponseModel,
    description: 'Logs in the user and returns the access token',
  })
  @ApiBadRequestResponse({
    description: 'Something is invalid on the request body',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials or User is not confirmed',
  })
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Res({ passthrough: true }) response: IInternalResponse,
    @Origin() origin: string,
    @Body() dto: SignInDto
  ) {
    const result = await this.authService.signIn(dto, origin,response);
    return AuthResponseMapper.map(result);
  }

  @Public()
  @Post('/sign-up')
  @ApiCreatedResponse({
    type: ResponseModel,
    description: 'The user has been created and is waiting confirmation',
  })
  @ApiConflictResponse({
    description: 'Email already in use',
  })
  @ApiBadRequestResponse({
    description: 'Something is invalid on the request body',
  })
  @HttpCode(HttpStatus.CREATED)
  public async signUp(@Body() signUpDto: SignUpDto): Promise<ResponseModel> {
    await this.authService.signUp(signUpDto);
    return new ResponseModel(null, 'Create user success');
  }
}
