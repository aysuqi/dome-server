import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationParamsDto {
  @ApiPropertyOptional({
    description: '当前页条数',
    type: Number,
    example: 5,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10))
  pageSize = 5;

  @ApiPropertyOptional({
    description: '当前页',
    type: Number,
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  page: 1;
}
