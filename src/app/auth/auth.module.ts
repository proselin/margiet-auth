import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MaJwtModule } from '../ma-jwt';
import { AuthController } from './auth.controller';
import { UserModule } from '../user';

@Module({
  imports: [MaJwtModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
