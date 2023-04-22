import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './configs/module-options';
import { DatabaseProviders } from './database.providers';
import { AppLoggerModule } from './logger/logger.module';

@Module({
  providers: [SystemService, ...DatabaseProviders],
  // 暴露 config 模块
  exports: [SystemService, ConfigModule, AppLoggerModule, ...DatabaseProviders],
  // 注入 config 模块
  imports: [ConfigModule.forRoot(configModuleOptions), AppLoggerModule],
})
export class SharedModule {}
