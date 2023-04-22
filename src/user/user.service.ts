import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SystemService } from '../shared/system.service';

@Injectable()
export class UserService {
  constructor(
    // 模块注入
    private readonly systemService: SystemService,
  ) {}

  create(createUserDto: CreateUserDto) {
    // 测试 SystemService
    console.log('system', this.systemService.test());
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
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
