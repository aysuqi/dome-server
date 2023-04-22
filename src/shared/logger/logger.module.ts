import { Module } from '@nestjs/common';
import { AppLogger } from './logger.service';

@Module({
  providers: [AppLogger],
  exports: [AppLogger],
  imports: [],
})
export class AppLoggerModule {}
