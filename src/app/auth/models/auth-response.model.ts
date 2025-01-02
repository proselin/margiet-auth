import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseModel {
  @ApiProperty({
    description: 'Access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    type: String,
  })
  public readonly accessToken: string;

  @ApiProperty({
    description: 'Refresh token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    type: String,
  })
  public readonly refreshToken: string;

  @ApiProperty({
    description: 'Token type',
    example: 'Bearer',
    type: String,
  })
  public readonly tokenType: string;

  @ApiProperty({
    description: 'Expiration period in seconds',
    example: 3600,
    type: Number,
  })
  public readonly expiresIn: number;

  @ApiProperty({
    description: 'Refresh token expiration period in seconds',
    example: 3600,
    type: Number,
  })
  public readonly refreshExpiresIn: number;
}
