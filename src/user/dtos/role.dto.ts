import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

// 创建角色表字段的配置
export class CreateRoleDto {
  @ApiProperty({ example: 'admin' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: {
      'dashboard/workplace': ['write', 'read'],
      user: ['read', 'write'],
      course: ['write', 'read'],
      role: ['read', 'write'],
    },
  })
  @IsNotEmpty()
  permissions: object;
}
