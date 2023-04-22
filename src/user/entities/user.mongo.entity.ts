import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column('text')
  phone: string;

  @Column('text')
  name: string;

  @Column('text')
  password: string;

  @Column({ length: 200 })
  email: string;
}
