import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ArticleService } from '../services/article.service';
import { CreateArticleDto } from '../dto/article.dto';
import {
  BaseApiErrorResponse,
  SwaggerBaseApiResponse,
} from 'src/shared/dots/base-api-response.dto';
import { PaginationParamsDto } from 'src/shared/dots/pagination-params.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { UploadDto } from 'src/user/dtos/upload.dto';

@ApiTags('文章管理')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: '新增文章' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(CreateArticleDto),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @Post('')
  create(@Body() articleDto: CreateArticleDto) {
    return this.articleService.create(articleDto);
  }

  @ApiOperation({ summary: '查询所有文章' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse([CreateArticleDto]),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @Get()
  async findAll(@Param() query: PaginationParamsDto): Promise<any> {
    const { data, total } = await this.articleService.findAll(query);
    return { data, total };
  }

  @ApiOperation({ summary: '查询单个文章' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(CreateArticleDto),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.articleService.find(id);
  }

  @ApiOperation({ summary: '跟新单个文章' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(CreateArticleDto),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: CreateArticleDto) {
    const data = await this.articleService.update(id, updateDto);
    return { data };
  }

  @ApiOperation({ summary: '删除一个文章' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.articleService.remove(id);
  }

  @ApiOperation({ summary: '文章导入' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/article/import')
  async articleImport(@UploadedFile() file, @Body() uploadDto: UploadDto) {
    await this.articleService.import(file);
    return;
  }
}
