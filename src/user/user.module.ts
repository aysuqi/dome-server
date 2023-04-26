import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { SharedModule } from 'src/shared/shared.module';
import { UserProviders } from './user.providers';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  controllers: [UserController, RoleController, AuthController],
  providers: [
    UserService,
    AuthService,
    ...UserProviders,
    RoleService,
    JwtStrategy,
  ],
  // 引用模块
  imports: [
    SharedModule,
    // 注册jwt
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [
        SharedModule,
        // 引入redis
        RedisModule.forRootAsync({
          imports: [SharedModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            config: configService.get('redis'),
          }),
        }),
      ],
      useFactory: (configService: ConfigService) => configService.get('jwt'),
    }),
  ],
})
export class UserModule {}
