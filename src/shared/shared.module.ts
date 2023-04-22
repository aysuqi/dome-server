import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './configs/module-options';
import { DatabaseProviders } from './database.providers';

@Module({
  providers: [SystemService, ...DatabaseProviders],
  // 暴露 config 模块
  exports: [SystemService, ConfigModule, ...DatabaseProviders],
  // 注入 config 模块
  imports: [ConfigModule.forRoot(configModuleOptions)],
})
export class SharedModule {}
