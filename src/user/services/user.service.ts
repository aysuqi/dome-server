import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { SystemService } from '../../shared/system.service';
import { MongoRepository } from 'typeorm';
import { User } from '../entities/user.mongo.entity';
import { AppLogger } from 'src/shared/logger/logger.service';
import { PaginationParamsDto } from 'src/shared/dots/pagination-params.dto';

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
    return this.userRepository.save(createUserDto);
  }

  async findAll({
    pageSize,
    page,
  }: PaginationParamsDto): Promise<{ data: User[]; total: number }> {
    const [data, total] = await this.userRepository.findAndCount({
      order: { name: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize * 1,
      cache: true,
    });
    return {
      data,
      total,
    };
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
