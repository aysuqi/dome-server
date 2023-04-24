import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { SharedModule } from 'src/shared/shared.module';
import { UserProviders } from './user.providers';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';

@Module({
  controllers: [UserController, RoleController],
  providers: [UserService, ...UserProviders, RoleService],
  imports: [SharedModule], // 引用模块
})
export class UserModule {}
