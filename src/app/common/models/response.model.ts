import { ApiProperty } from '@nestjs/swagger';

export class ResponseModel<T = unknown> {
  @ApiProperty({
    description: 'Response data ',
    example: {
      securityQuestionItalian: {
        question: 'Said something to improve you are italian.',
        answer: 'Pizza !!!',
      },
    },
    type: Object,
  })
  data: T;
  @ApiProperty({
    description: 'Response message',
    example: 'Success',
    type: String,
  })
  message: string;

  constructor(data: T, message?: string) {
    this.data = data;
    this.message = message ?? 'no-message';
  }
}
