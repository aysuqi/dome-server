import { Common } from 'src/shared/entities/common.entity';
import { Column, Entity } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity()
export class User extends Common {
  // 昵称
  @Column('text')
  name: string;

  // 头像
  @Column('text')
  avatar: string;

  // 邮箱
  @Column({ length: 200 })
  email: string;

  // 手机号
  @Column('text')
  phoneNumber: string;

  // 密码
  @Column()
  password: string;

  // 角色
  @Column()
  role?: ObjectId;

  // 工作
  @Column()
  job: string;

  // 工作名称
  @Column()
  jobName: string;

  // 组织
  @Column()
  organization: string;

  // 组织名称
  @Column()
  organizationName: string;

  // 位置
  @Column()
  location: string;

  // 位置名称
  @Column()
  locationName: string;

  // 介绍
  @Column()
  introduction: string;

  // 个人网站
  @Column()
  personalWebsite: string;

  // 验证
  @Column('boolean')
  verified: boolean;

  // 加密盐
  @Column({
    type: 'text',
    select: false,
  })
  salt: string;

  @Column()
  isAccountDisabled?: boolean;
}
