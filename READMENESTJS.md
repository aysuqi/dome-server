# 创建项目

## 使用的技术

- `@nestjs/swagger`: API接口文档
- `class-validator class-transformer`: 数据校验
- `@nestjs/config`: 配置环境变量
- `typeorm`: 结合 mongodb 实现数据持久化
- `mongodb`: 使用版本 mongodb@"^3.6.0"
- `winston`: 实现分级日志收集

## 使用脚手架创建项目

- 安装脚手架

```bash
npm i -g @nestjs/cli
```

- 创建基础项目

```bash
nest new dome-server
```

- 目录结构

```bash
src
 ├── app.controller.spec.ts
 ├── app.controller.ts  # 控制器
 ├── app.module.ts      # 模块定义
 ├── app.service.ts     # service层
 └── main.ts            # 入口
```

- 利用CLI 生成代码

```bash
nest g mo xxx   # 生成 Module
nest g co xxx  # 生成 Controller
nest g s xxx   # 生成 Service
nest g resource xxx # 生成一套Restful风格接口
```

## 引入 Swagger 实现 Api 接口文档

- [参考Swagger官网](https://link.zhihu.com/?target=https://swagger.io/)

- 安装

```bash
pnpm i @nestjs/swagger
```

- 使用

1. `src/doc.ts`

```ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as packageConfig from '../package.json';

export const generateDocument = (app) => {
  const { name, description, version } = packageConfig;
  // 文档的配置项
  const options = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth() // 增加鉴权功能
    .build();

  // 创建文档
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('/api/doc', app, document);
};

```

2. `src/main.ts`

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { generateDocument } from './doc';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 创建 swagger api 文档
  generateDocument(app);
  await app.listen(3000);
}
bootstrap();

```

3. 基础配置

`src/user/user.controller.ts`

```ts
  @ApiOperation({
    summary: '新增用户',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateUserDto,
  })
  @ApiBearerAuth()
  create(@Body() createUserDto: CreateUserDto) {
    ...
  }
```

4. 启动项目后再浏览器中打开：`http://localhost:3000/api/doc#/`就可以看到 swagger 风格的 api 接口了

## Controller 与 HTTP接口实现

- 基础接口的实现和应用

`src/user/dto/create-user.dto.ts`

```ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: '18759112345' })
  readonly phone: string;

  @ApiProperty({ example: 'dome' })
  name: string;

  @ApiProperty({ example: '123456' })
  passowrd: string;

  @ApiProperty({ example: '1@1.com' })
  email: string;
}

```

`src/user/user.controller.ts`

```ts
  ...
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateUserDto,
  })
  @ApiBearerAuth()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
```

## 使用Pipe管道及应用，实现借口校验

- 参考资源
  - [https://github.com/su37josephxia/admin-server-nestjs/tree/0](https://github.com/su37josephxia/admin-server-nestjs/tree/04)5
  - [https://docs.nestjs.com/techniques/validation](https://docs.nestjs.com/techniques/validation)
  - [https://github.com/typestack/class-validator](https://github.com/typestack/class-validator)

- 安装

```bash
pnpm i class-validator class-transformer
```

- 使用

`src/user/dto/create-user.dto.ts`

```ts
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches, Max, Min, Length, IsEmail } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: '18321312321' })
    @Matches(/^1\d{10}$/g, { message: '请输入手机号' })
    phoneNumber: string;

    @ApiProperty({ example: '11111' })
    @IsNotEmpty()
    @Length(6, 10)
    password: string;

    @ApiProperty({ example: 'aa@qq.com' })
    @IsEmail()
    email: string;
}
```

## 模块化Modules

- 公共模块，在其他模块下的调用，假定【 user 】模块需要调用公共模块 【shared】

- 创建公共模块

`src/shared/system.service.ts`

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class SystemService {
  test() {
    return { text: 'test system-service' };
  }
}

```

`src/shared/shared.module.ts`

```ts
import { Module } from '@nestjs/common';
import { SystemService } from './system.service';

@Module({
  // 注册 
  providers: [SystemService],
  // 暴露 config 模块
  exports: [SystemService],
})
export class SharedModule {}

```

- 使用

`src/user/user.module.ts`

```ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  // 引用公共模块「SharedModule」
  imports: [SharedModule],
})
export class UserModule {}

```

`src/user/user.service.ts`

```ts
import { SystemService } from '../shared/system.service';

export class UserService {
  constructor(
    // 模块注入
    private readonly systemService: SystemService,
  ) {}

  create(createUserDto: CreateUserDto) {
    // 测试 SystemService
    console.log('system', this.systemService.test());
    ....
  }
}
```

## 配置环境变量及使用

- 安装

```bash
pnpm i @nestjs/config
```

- 配置（创建.env文件）

`.env`

``` js
# APP
APP_ENV=development
APP_PORT=3000
# DB MONGODB
DB_URL=mongodb://localhost:27017
DB_NAME=nest-server
DB_USER=xxxx
DB_PASS=123456
DB_ENTITY_NAME=mongo
DB_SYNCHRONIZE=false
DB_LOGGING=true
```

- 封装方法

`src/shared/configs/configuration.ts`

```ts
export default (): any => ({
  env: process.env.APP_ENV,
  port: process.env.APP_PORT,
  database: {
    url: process.env.DB_URL,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    synchronize: process.env.DB_SYNCHRONIZE,
    logging: process.env.DB_LOGGING,
  },
});
```

`src/shared/configs/module-options.ts`

```ts
import { ConfigModuleOptions } from '@nestjs/config';
import configuration from './configuration';

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: '.env',
  load: [configuration],
};
```

- 使用

`src/shared/shared.module.ts`

```ts
import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './configs/module-options';

@Module({
  providers: [SystemService],
  // 暴露 config 模块
  exports: [SystemService, ConfigModule, ],
  // 注入 config 模块
  imports: [ConfigModule.forRoot(configModuleOptions), AppLoggerModule],
})
export class SharedModule {}
```

`src/user/user.service.ts`

```ts
import { ConfigService } from '@nestjs/config';
export class UserController {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @ApiOperation({
    summary: '新增用户',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateUserDto,
  })
  @ApiBearerAuth()
  create(@Body() createUserDto: CreateUserDto) {
    // 测试全局配置信息
    console.log('ENV:URL:', this.configService.get<string>('database.url'));
    ...
  }
  ...
}
```

## 使用TypeORM实现数据持久化(结合mongoDB数据库)

- 安装

```bash
pnpm i typeorm mongodb@"^3.6.0"
```

- 封装

`src/shared/database.providers.ts`

```ts
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';

// 设置数据库类型
const databaseType: DataSourceOptions['type'] = 'mongodb';

// 数据库注入
export const DatabaseProviders = [
  {
    provide: 'MONGODB_DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const config = {
        type: databaseType,
        url: configService.get<string>('database.url'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.pass'),
        database: configService.get<string>('database.name'),
        entities: [path.join(__dirname, `../../**/*.mongo.entity{.ts,.js}`)],
        logging: configService.get<boolean>('database.logging'),
        synchronize: configService.get<boolean>('database.synchronize'),
      };
      const ds = new DataSource(config);
      await ds.initialize();
      return ds;
    },
  },
];
```

- 使用

`src/shared/shared.module.ts`

```ts
import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './configs/module-options';
import { DatabaseProviders } from './database.providers';

@Module({
  // 注册 DatabaseProviders
  providers: [SystemService, ...DatabaseProviders],
  // 暴露 DatabaseProviders
  exports: [SystemService, ConfigModule, ...DatabaseProviders],
  ...
})
export class SharedModule {}
```

`src/user/user.providers.ts`

```ts
import { User } from './entities/user.mongo.entity';

export const UserProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: async (AppDataSource) =>
      await AppDataSource.getRepository(User),
    inject: ['MONGODB_DATA_SOURCE'],
  },
];
```

`src/user/user.module.ts`

```ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SharedModule } from 'src/shared/shared.module';
import { UserProviders } from './user.providers';

@Module({
  controllers: [UserController],
  providers: [UserService, ...UserProviders],
  imports: [SharedModule], // 引用模块
})
export class UserModule {}
```

`src/user/entities/user.mongo.entity.ts`

```ts
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
```

`src/user/user.service.ts`

```ts
import { MongoRepository } from 'typeorm';
export class UserService {
  constructor(
    // 注入 mongo 数据库
    @Inject('USER_REPOSITORY')
    private readonly userRepository: MongoRepository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    // 测试 mongo 数据库
    return this.userRepository.save({
      phone: '18712312345',
      name: 'mongo',
      password: '123456',
      email: '1@1.com',
    });
  }
}
```

## 使用Winston实现分级日志收集

- 安装

```bash
pnpm i winston
```

- 使用

`src/shared/logger/logger.service.ts`

```ts
import { Logger, createLogger, format, transports } from 'winston';

export class AppLogger {
  private context?: string;
  private logger: Logger;

  public setContext(context: string): void {
    this.context = context;
  }

  constructor() {
    this.logger = createLogger({
      level: process.env.LOGGER_LEVEL,
      format: format.combine(format.timestamp(), format.prettyPrint()),
      transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
      ],
    });
  }

  error(ctx: any, message: string, meta?: Record<string, any>): Logger {
    return this.logger.error({
      message,
      contextNmae: this.context,
      ctx,
      ...meta,
    });
  }

  warn(ctx: any, message: string, meta?: Record<string, any>): Logger {
    return this.logger.warn({
      message,
      contextNmae: this.context,
      ctx,
      ...meta,
    });
  }

  debug(ctx: any, message: string, meta?: Record<string, any>): Logger {
    return this.logger.debug({
      message,
      contextNmae: this.context,
      ctx,
      ...meta,
    });
  }

  info(ctx: any, message: string, meta?: Record<string, any>): Logger {
    return this.logger.info({
      message,
      contextNmae: this.context,
      ctx,
      ...meta,
    });
  }
}
```

`src/shared/logger/logger.module.ts`

```ts
import { Module } from '@nestjs/common';
import { AppLogger } from './logger.service';

@Module({
  providers: [AppLogger],
  exports: [AppLogger],
  imports: [],
})
export class AppLoggerModule {}
```

`src/shared/shared.module.ts`

```ts
import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './configs/module-options';
import { DatabaseProviders } from './database.providers';
import { AppLoggerModule } from './logger/logger.module';

@Module({
  providers: [SystemService, ...DatabaseProviders],
  // 暴露 config 模块
  exports: [SystemService, ConfigModule, AppLoggerModule, ...DatabaseProviders],
  // 注入 config 模块
  imports: [ConfigModule.forRoot(configModuleOptions), AppLoggerModule],
})
export class SharedModule {}
```

`src/user/user.service.ts`

```ts
...
import { MongoRepository } from 'typeorm';

export class UserService {
  constructor(
    ...
    // 注入日志
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(UserService.name);
  }

  ...

  findAll() {
    // 测试日志
    this.logger.info(null, 'test logger', { name: 'logger info' });
    this.logger.debug(null, 'test logger', { name: 'logger debug' });
    return this.userRepository.findAndCount({});
  }
}
```
