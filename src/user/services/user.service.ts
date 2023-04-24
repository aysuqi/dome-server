import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { MongoRepository } from 'typeorm';
import { User } from '../entities/user.mongo.entity';
import { PaginationParamsDto } from 'src/shared/dots/pagination-params.dto';

@Injectable()
export class UserService {
  constructor(
    // 注入 mongo 数据库
    @Inject('USER_REPOSITORY')
    private readonly userRepository: MongoRepository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.save(createUserDto);
  }

  async findAll({
    pageSize,
    page,
  }: PaginationParamsDto): Promise<{ data: User[]; total: number }> {
    const [data, total] = await this.userRepository.findAndCount({
      order: { createAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize * 1,
      cache: true,
    });
    return {
      data,
      total,
    };
  }

  async findOne(id: number) {
    return await this.userRepository.findOneBy(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<any> {
    return await this.userRepository.delete(id);
  }
}
