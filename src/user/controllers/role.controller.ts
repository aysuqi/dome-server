import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleService } from '../services/role.service';
import {
  BaseApiErrorResponse,
  SwaggerBaseApiResponse,
} from 'src/shared/dots/base-api-response.dto';
import { CreateRoleDto } from '../dtos/role.dto';
import { PaginationParamsDto } from 'src/shared/dots/pagination-params.dto';

@ApiTags('角色管理')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: '新增角色' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(CreateRoleDto),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @Post('')
  create(@Body() role: CreateRoleDto) {
    return this.roleService.create(role);
  }

  @ApiOperation({ summary: '查找所有角色' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse([CreateRoleDto]),
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: BaseApiErrorResponse })
  @Get()
  async findAll(@Query() query: PaginationParamsDto) {
    const { data, total } = await this.roleService.findAll(query);
    return { data, total };
  }

  @ApiOperation({ summary: '查询单个角色' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(CreateRoleDto),
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.roleService.findOne(id);
  }

  @ApiOperation({ summary: '更新单个角色' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(CreateRoleDto),
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: BaseApiErrorResponse })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCourseDot: CreateRoleDto,
  ) {
    return {
      data: await this.roleService.update(id, updateCourseDot),
    };
  }

  @ApiOperation({ summary: '删除单个角色' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.roleService.remove(id);
  }
}
