import { Inject, Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { Role } from '../entities/role.mongo.entity';
import { CreateRoleDto } from '../dtos/role.dto';
import { PaginationParamsDto } from 'src/shared/dots/pagination-params.dto';

@Injectable()
export class RoleService {
  constructor(
    @Inject('ROLE_REPOSITORY')
    private readonly RoleRepository: MongoRepository<Role>,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    return this.RoleRepository.save(createRoleDto);
  }

  async findAll({
    pageSize,
    page,
  }: PaginationParamsDto): Promise<{ data: Role[]; total: number }> {
    const [data, total] = await this.RoleRepository.findAndCount({
      order: { createAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize * 1,
      cache: true,
    });
    return { data, total };
  }

  async findOne(id: string) {
    return await this.RoleRepository.findOneBy(id);
  }

  async update(id: string, role: CreateRoleDto) {
    // 去除时间戳和id
    ['_id', 'createAt', 'updateAt'].forEach((k) => delete Role[k]);
    // 更新时间戳
    return await this.RoleRepository.update(id, role);
  }

  async remove(id: string) {
    return await this.RoleRepository.delete(id);
  }
}
