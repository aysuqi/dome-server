import { Inject, Injectable } from '@nestjs/common';
import { CreateArticleDto } from '../dto/article.dto';
import { MongoRepository } from 'typeorm';
import { Article } from '../entities/article.mongo.entity';
import { PaginationParamsDto } from 'src/shared/dots/pagination-params.dto';

@Injectable()
export class ArticleService {
  constructor(
    @Inject('ARTICLE_REPOSITORY')
    private readonly articleRepository: MongoRepository<Article>,
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
    return await this.articleRepository.update(id, updateDto);
  }

  async remove(id: string) {
    return await this.articleRepository.delete(id);
  }
}
