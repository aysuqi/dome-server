import {
  Column,
  CreateDateColumn,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export abstract class Common {
  @ObjectIdColumn()
  _id: ObjectId;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Column({ default: false, select: false })
  isDelete: boolean;

  @VersionColumn({ select: false })
  version: number;
}
