import { Controller, Get, Logger, Res } from '@nestjs/common';
import { RequestId } from './common/decorators';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAdapterService } from './jwt-adapter';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private jwtAdapter: JwtAdapterService) {}

  @Get()
  @ApiOperation({ summary: 'Get example data' })
  @ApiResponse({ status: 200, description: 'Success' })
  helloWorld(@RequestId() id: string, @Res() response: Response) {
    Logger.log(id);
    response.cookie('session', '12312', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3000000,
    });
    response.jsonp({ message: this.jwtAdapter.origin.sign({ userId: null }) });
  }
}
