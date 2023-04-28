import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { MongoRepository } from 'typeorm';
import { User } from '../entities/user.mongo.entity';
import { PaginationParamsDto } from 'src/shared/dots/pagination-params.dto';
import { encryptPassword, makeSalt } from 'src/shared/utils/cryptogram.utiils';
import { UploadService } from '../../shared/upload/upload.service';

@Injectable()
export class UserService {
  constructor(
    // 注入 mongo 数据库
    @Inject('USER_REPOSITORY')
    private readonly userRepository: MongoRepository<User>,
    private readonly uploadService: UploadService,
  ) {}

  async create(user: CreateUserDto) {
    // 加密处理
    if (user.password) {
      const { salt, hashPassword } = this.getPassword(user.password);
      user.password = hashPassword;
      user.salt = salt;
    }
    return await this.userRepository.save(user);
  }

  async findAll({
    pageSize,
    page,
  }: PaginationParamsDto): Promise<{ data: User[]; total: number }> {
    const [data, total] = await this.userRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize * 1,
      cache: true,
    });
    return {
      data,
      total,
    };
  }

  async findOne(id: string) {
    return await this.userRepository.findOneBy(id);
  }

  async update(id: string, user: CreateUserDto) {
    // 加密处理
    if (user.password) {
      const { salt, hashPassword } = this.getPassword(user.password);
      user.password = hashPassword;
      user.salt = salt;
    }
    return await this.userRepository.update(id, user);
  }

  async remove(id: string): Promise<any> {
    return await this.userRepository.delete(id);
  }

  async uploadAvatar(file) {
    const { url } = await this.uploadService.upload(file);
    return { data: url };
  }

  /**
   * 获取密码盐
   * @param password
   * @returns
   */
  getPassword(password) {
    const salt = makeSalt(); // 制作密码盐
    const hashPassword = encryptPassword(password, salt); // 加密密码
    return { salt, hashPassword };
  }
}
