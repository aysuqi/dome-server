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
