import { Common } from 'src/shared/entities/common.entity';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class User extends Common {
  @Column('text')
  phone: string;

  @Column('text')
  name: string;

  @Column('text')
  password: string;

  @Column({ length: 200 })
  email: string;
}
