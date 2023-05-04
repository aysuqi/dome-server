import { Inject, Injectable } from '@nestjs/common';
import { CreateArticleDto } from '../dto/article.dto';
import { MongoRepository } from 'typeorm';
import { Article } from '../entities/article.mongo.entity';
import { PaginationParamsDto } from 'src/shared/dots/pagination-params.dto';
import { UploadService } from 'src/shared/upload/upload.service';
import compressing from 'compressing';
import path from 'path';
import fs from 'fs';
import { MenuService } from './menu.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ArticleService {
  constructor(
    @Inject('ARTICLE_REPOSITORY')
    private readonly articleRepository: MongoRepository<Article>,
    private readonly uploadService: UploadService,
    private readonly menuService: MenuService,
    private readonly configService: ConfigService,
  ) {}

  create(articleDto: CreateArticleDto) {
    return this.articleRepository.save(articleDto);
  }

  async findAll({
    pageSize,
    page,
  }: PaginationParamsDto): Promise<{ data: Article[]; total: number }> {
    const [data, total] = await this.articleRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize * 1,
      cache: true,
    });

    return { data, total };
  }

  async find(id: string) {
    return await this.articleRepository.findOneBy(id);
  }

  async update(id: string, updateDto: CreateArticleDto) {
    // 去除时间戳和id
    ['_id', 'cerateAt', 'updateAt'].forEach((k) => delete Article[k]);
    await this.sync(id);
    return await this.articleRepository.update(id, updateDto);
  }

  async remove(id: string) {
    return await this.articleRepository.delete(id);
  }

  /**
   * 同步文章
   * @param id
   * @returns
   */
  async sync(id: string) {
    const secret = this.configService.get<string>('cms.validateToken');
    const host = this.configService.get<string>('cms.host');
    const url = `api/revalidate?secret=${secret}&id=${id}`;
    try {
      await axios.get(host + '/' + url);
    } catch (error) {
      console.log('同步失败');
      throw error;
    }
    return;
  }

  /**
   * 文章批量上传
   * @param file
   */
  async import(file) {
    const uploadFile = await this.uploadService.upload(file);
    // 解压缩
    const root = uploadFile.path.replace(path.extname(uploadFile.path), '');
    await compressing.zip.uncompress(uploadFile.path, root);
    this.articleRepository.deleteMany({});

    const list = fs
      .readdirSync(root)
      .filter((menu) => menu !== 'image')
      .filter((menu) => fs.statSync(root + '/' + menu).isDirectory());

    const menus = [];
    for (const menu of list) {
      menus.push(await this.importCategory(menu, root + '/' + menu));
    }

    await this.menuService.update({ menus });
    await fs.rmSync(uploadFile.path);
    await fs.rmdirSync(root, { recursive: true });

    return;
  }

  async importCategory(name, category) {
    const list = fs
      .readdirSync(category)
      .filter((v) => fs.statSync(category + '/' + v).isDirectory());

    const children = [];
    for (const article of list) {
      children.push(
        await this.importArticle(article, category + '/' + article),
      );
    }

    return {
      key: Date.now().toString(),
      title: name.slice(3),
      type: 'category',
      children,
    };
  }

  async importArticle(title, dir) {
    const list = fs.readdirSync(dir).filter((v) => v !== 'image');
    if (!list[0]) return;
    const artitle = dir + '/' + list[0];
    const content = fs.readFileSync(artitle).toString();
    title = title.replace('.md', '');
    const { _id } = await this.articleRepository.create({
      title,
      content,
    });
    return { key: _id, title, type: 'article' };
  }
}
