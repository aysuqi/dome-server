import { Inject, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongoRepository } from 'typeorm';
import { User } from '../entities/user.mongo.entity';
import { LoginDto } from '../dtos/login.dto';
import { encryptPassword } from 'src/shared/utils/cryptogram.utiils';

export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: MongoRepository<User>,
  ) {}

  // 生成 token
  async certificate(user: User) {
    const payload = { id: user._id };
    const token = this.jwtService.sign(payload);
    return token;
  }

  /**
   * 登陆校验用户信息
   * @param loginDto
   * @returns
   */
  async checkLoginFrom(loginDto: LoginDto): Promise<any> {
    // 获取用户信息
    const { phoneNumber, password } = loginDto;
    const user = await this.userRepository.findOneBy({ phoneNumber });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    // 密码比对
    const { password: dbPassword, salt } = user;
    const currentHashPassword = encryptPassword(password, salt);
    if (currentHashPassword !== dbPassword) {
      throw new NotFoundException('密码错误');
    }

    return user;
  }

  async login(loginDto: LoginDto): Promise<any> {
    // 校验用户信息
    const user = await this.checkLoginFrom(loginDto);
    // 生成 token
    const token = await this.certificate(user);

    return {
      data: {
        token,
      },
    };
  }
}
