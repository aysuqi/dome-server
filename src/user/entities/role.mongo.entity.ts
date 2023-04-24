import { Common } from 'src/shared/entities/common.entity';
import { Column, Entity } from 'typeorm';

// 角色表字段的配置
@Entity()
export class Role extends Common {
  // 角色名称
  @Column('text')
  name: string;

  // 权限
  @Column('')
  permissions: object;
}
