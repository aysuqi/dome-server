import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@Controller('users')
@ApiTags('用户管理')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @ApiOperation({
    summary: '新增用户',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateUserDto,
  })
  @ApiBearerAuth()
  create(@Body() createUserDto: CreateUserDto) {
    // 测试全局配置信息
    console.log('ENV:URL:', this.configService.get<string>('database.url'));
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: '查询所有用户',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateUserDto,
  })
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({
    summary: '查询一个用户',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateUserDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @ApiOperation({
    summary: '更新用户信息',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateUserDto,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @ApiOperation({
    summary: '删除用户',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateUserDto,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
