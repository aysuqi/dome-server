import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({
    example: [
      {
        key: 'xxx',
        title: '一级标题',
        type: 'category',
        children: [
          {
            key: 'xxx',
            title: '文章一',
            type: 'article',
          },
        ],
      },
    ],
  })
  menus: any[];
}
