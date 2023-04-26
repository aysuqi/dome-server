import { Inject, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongoRepository } from 'typeorm';
import { User } from '../entities/user.mongo.entity';
import { LoginDto } from '../dtos/login.dto';
import { encryptPassword } from 'src/shared/utils/cryptogram.utiils';
import { RegisterCodeDTO, UserInfoDto } from '../dtos/auth.dto';
import { Role } from '../entities/role.mongo.entity';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    // 引入用户表
    @Inject('USER_REPOSITORY')
    private readonly userRepository: MongoRepository<User>,
    // 引入角色表
    @Inject('ROLE_REPOSITORY')
    private readonly roleRepository: MongoRepository<Role>,
    // 引入 redis
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  /**
   * 生成 token
   * @param user
   * @returns
   */
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

  /**
   * 登录
   * @param loginDto
   * @returns
   */
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

  /**
   * 获取登录用户信息
   * @param id
   * @returns
   */
  async info(id: string) {
    // 查询用户并获取权限
    const user = await this.userRepository.findOneBy(id);
    const data: UserInfoDto = Object.assign({}, user);

    if (user.role) {
      const role = await this.roleRepository.findOneBy(user.role);
      if (role) data.permissions = role.permissions;
    }

    return data;
  }

  /**
   * 获取验证码（四位随机数字）
   * @returns
   */
  generateCode() {
    return [0, 0, 0, 0].map(() => parseInt(Math.random() * 10 + '')).join('');
  }

  /**
   * 获取 redis 的数据
   * @param mobile
   * @returns
   */
  async getMobileVerifyCode(mobile: string) {
    return await this.redis.get('verifyCode' + mobile);
  }

  /**
   * 获取验证码
   * @param codeDto
   * @returns
   */
  async registerCode(codeDto: RegisterCodeDTO) {
    const { phoneNumber } = codeDto;
    const redisData = await this.getMobileVerifyCode(phoneNumber);
    if (redisData !== null) {
      // 验证码未过期
      throw new NotFoundException('验证码未过期,无需再次发送');
    }
    const code = this.generateCode();
    await this.redis.set('verifyCode' + phoneNumber, code, 'EX', 60);
    return code;
  }
}
