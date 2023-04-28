import { Inject, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongoRepository } from 'typeorm';
import { User } from '../entities/user.mongo.entity';
import { LoginDto } from '../dtos/login.dto';
import { encryptPassword, makeSalt } from 'src/shared/utils/cryptogram.utiils';
import { RegisterCodeDTO, RegisterSMSDTO, UserInfoDto } from '../dtos/auth.dto';
import { Role } from '../entities/role.mongo.entity';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { CaptchaService } from '../../shared/services/captcha.service';
import { AppLogger } from 'src/shared/logger/logger.service';
import { RegisterDTO } from '../dtos/auth.dto';
import { UserService } from './user.service';

export class AuthService {
  constructor(
    private readonly logger: AppLogger,
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

    private readonly captchaService: CaptchaService,
    private readonly userService: UserService,
  ) {
    this.logger.setContext(AuthService.name);
  }

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
    const { phoneNumber, captchaId, captchaCode } = codeDto;
    // 校验图形验证码
    const captcha = await this.redis.get('captcha' + captchaId);
    if (
      !captcha ||
      captcha.toLocaleLowerCase() !== captchaCode.toLocaleLowerCase()
    ) {
      throw new NotFoundException('图形验证码错误');
    }

    // 获取短信验证码
    const redisData = await this.getMobileVerifyCode(phoneNumber);
    if (redisData !== null) {
      // 验证码未过期
      throw new NotFoundException('验证码未过期,无需再次发送');
    }
    const code = this.generateCode();
    this.logger.info(null, '验证码:', { code });
    // 验证码存入将Redis
    await this.redis.set('verifyCode' + phoneNumber, code, 'EX', 60);
    return '';
  }

  /**
   * 获取图形验证码
   */
  async getCaptcha() {
    const { data, text } = await this.captchaService.createCaptcha();
    const id = makeSalt(4);
    this.logger.info(null, '图形验证码:', { id, text });
    // 验证码存入将Redis
    this.redis.set('captcha' + id, text, 'EX', 600);
    const image = `data:image/svg+xml;base64,${Buffer.from(data).toString(
      'base64',
    )}`;

    return { id, image };
  }

  /**
   * 校验注册信息
   * @param dto
   */
  async checkRegisterFrom(dto: RegisterDTO): Promise<any> {
    const { password, passwordRepeat, phoneNumber } = dto;
    // 校验密码是否一致
    if (password !== passwordRepeat) {
      throw new NotFoundException('两次输入的密码不一致，请检查');
    }

    // 校验用户是否存在
    const hasUser = await this.userRepository.findOneBy({ phoneNumber });
    if (hasUser) {
      throw new NotFoundException('用户已存在');
    }
  }

  /**
   * 注册新用户
   * @param dto
   * @returns
   */
  async register(dto: RegisterDTO): Promise<any> {
    const { password, name, phoneNumber } = dto;
    // 校验注册信息
    await this.checkRegisterFrom(dto);
    // 创建新用户
    const { salt, hashPassword } = this.userService.getPassword(password);
    const newUser: User = new User();
    newUser.phoneNumber = phoneNumber;
    newUser.name = name;
    newUser.password = hashPassword;
    newUser.salt = salt;
    const data = await this.userRepository.save(newUser);
    this.logger.info(null, '注册新用户', { ...data });

    return { data };
  }

  /**
   * 短信注册
   * @param smsDto
   * @returns
   */
  async registerBySMS(smsDto: RegisterSMSDTO): Promise<any> {
    const { phoneNumber, smsCode } = smsDto;
    // 短信验证码校验
    const code = await this.getMobileVerifyCode(phoneNumber);
    if (smsCode !== code) {
      throw new NotFoundException('验证码不一致，或已过期');
    }
    // 用户是否存在
    let user = await this.userRepository.findOneBy({ phoneNumber });
    if (!user) {
      // 用户不存在匿名注册
      const password = makeSalt(8);
      user = await this.register({
        phoneNumber,
        name: `手机用户${phoneNumber}`,
        password,
        passwordRepeat: password,
      });
    }

    const token = await this.certificate(user);
    return {
      data: {
        token,
      },
    };
  }
}
