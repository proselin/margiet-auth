import { Module } from '@nestjs/common';
import { JwtAdapterService } from './jwt-adapter.service';

@Module({
  providers: [JwtAdapterService],
  exports: [JwtAdapterService],
})
export class JwtAdapterModule {}
