import { Module } from '@nestjs/common';
import { CMSProviders } from './cms.providers';
import { ArticleController } from './controllers/article.controller';
import { MenuController } from './controllers/menu.controlles';
import { ArticleService } from './services/article.service';
import { MenuService } from './services/menu.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  controllers: [ArticleController, MenuController],
  providers: [ArticleService, MenuService, ...CMSProviders],
  exports: [],
  imports: [SharedModule],
})
export class CMSModule {}
