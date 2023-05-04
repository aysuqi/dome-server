import { Inject, Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { Menu } from '../entities/menu.mongo.entity';
import { CreateMenuDto } from '../dto/menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @Inject('MENU_REPOSITORY')
    private readonly menuRepository: MongoRepository<Menu>,
  ) {}

  async find(): Promise<{ data: object }> {
    const data = await this.menuRepository.findOneBy({});
    return {
      data: data ? data : { menu: {} },
    };
  }

  async update(updateDto: CreateMenuDto): Promise<any> {
    ['_id', 'createAt', 'updateAt'].forEach((k) => delete updateDto[k]);
    return await this.menuRepository.updateOne(
      {},
      { $set: updateDto },
      { upsert: true },
    );
  }
}
