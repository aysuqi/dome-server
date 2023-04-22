import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as packageConfig from '../package.json';

// Swagger官网: https://link.zhihu.com/?target=https://swagger.io/

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
