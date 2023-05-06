import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { generateDocument } from './doc';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { RemoveSensitiveInfoInterceptor } from './shared/interceptors/remove-sensitive-info.interceptor';
import helmet from 'helmet';

async function bootstrap() {
  // 修改运行平台
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 判断是否存在此文件夹
  const uploadDir =
    !!process.env.UPLOAD_DIR && process.env.UPLOAD_DIR !== ''
      ? process.env.UPLOAD_DIR
      : join(__dirname, '../../../', 'static/upload');

  // 静态服务
  app.useStaticAssets(uploadDir, {
    prefix: '/static/upload',
  });

  // 添加全局拦截器
  app.useGlobalInterceptors(new RemoveSensitiveInfoInterceptor());

  // 添加全局管道
  app.useGlobalPipes(
    new ValidationPipe({
      // 允许不能识别的值
      forbidUnknownValues: false,
    }),
  );

  // 基于Helmet的HTTP安全加固
  app.use(helmet());

  // 创建 swagger api 文档
  generateDocument(app);
  await app.listen(3000);
}
bootstrap();
