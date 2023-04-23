import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { SharedModule } from 'src/shared/shared.module';
import { UserProviders } from './user.providers';

@Module({
  controllers: [UserController],
  providers: [UserService, ...UserProviders],
  imports: [SharedModule], // 引用模块
})
export class UserModule {}
