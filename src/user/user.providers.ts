import { Role } from './entities/role.mongo.entity';
import { User } from './entities/user.mongo.entity';

// 数据库表的配置
export const UserProviders = [
  {
    // 用户表
    provide: 'USER_REPOSITORY',
    useFactory: async (AppDataSource) =>
      await AppDataSource.getRepository(User),
    inject: ['MONGODB_DATA_SOURCE'],
  },
  {
    // 角色表
    provide: 'ROLE_REPOSITORY',
    useFactory: async (AppDataSource) =>
      await AppDataSource.getRepository(Role),
    inject: ['MONGODB_DATA_SOURCE'],
  },
];
