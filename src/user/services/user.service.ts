import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { SystemService } from '../../shared/system.service';
import { MongoRepository } from 'typeorm';
import { User } from '../entities/user.mongo.entity';
import { AppLogger } from 'src/shared/logger/logger.service';

@Injectable()
export class UserService {
  constructor(
    // 模块注入
    private readonly systemService: SystemService,
    // 注入 mongo 数据库
    @Inject('USER_REPOSITORY')
    private readonly userRepository: MongoRepository<User>,
    // 注入日志
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(UserService.name);
  }

  create(createUserDto: CreateUserDto) {
    // 测试 SystemService
    console.log('system', this.systemService.test());
    // 测试 mongo 数据库
    return this.userRepository.save({
      phone: '18712312345',
      name: 'mongo',
      password: '123456',
      email: '1@1.com',
    });
  }

  findAll() {
    // 测试日志
    this.logger.info(null, 'test logger', { name: 'logger info' });
    this.logger.debug(null, 'test logger', { name: 'logger debug' });
    return this.userRepository.findAndCount({});
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
