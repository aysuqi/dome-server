import { Module } from '@nestjs/common';
import { SystemService } from './system.service';

@Module({
  providers: [SystemService],
  exports: [SystemService],
  imports: [],
})
export class SharedModule {}
