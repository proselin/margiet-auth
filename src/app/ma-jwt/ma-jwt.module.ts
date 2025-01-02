import { Global, Module } from '@nestjs/common';
import { MaJwtService } from './ma-jwt.service';

@Global()
@Module({
  providers: [MaJwtService],
  exports: [MaJwtService],
})
export class MaJwtModule {}
