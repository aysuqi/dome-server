import { Common } from 'src/shared/entities/common.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Article extends Common {
  @Column('text')
  title: string;

  @Column('text')
  content: string;
}
