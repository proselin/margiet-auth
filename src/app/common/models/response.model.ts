import { HttpStatus } from '@nestjs/common';

export class ResponseModel {
  code: HttpStatus;
  data: unknown;
  message: string;

  constructor(data: unknown) {
    this.data = data;
  }
}
