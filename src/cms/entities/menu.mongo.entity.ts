import { Common } from 'src/shared/entities/common.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Menu extends Common {
  @Column('')
  menus: [];
}
