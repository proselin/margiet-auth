import { User } from '../entities';
import { Expose, plainToInstance } from 'class-transformer';
import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';

export class UserResponseModel {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsBoolean()
  confirmed: boolean;

  static fromEntity(user: User) {
    return plainToInstance(UserResponseModel, user, {
      excludeExtraneousValues: true
    });
  }
}