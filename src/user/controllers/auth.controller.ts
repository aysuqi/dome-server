import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from '../dtos/login.dto';
import {
  BaseApiErrorResponse,
  SwaggerBaseApiResponse,
} from 'src/shared/dots/base-api-response.dto';
import { AuthService } from '../services/auth.service';
import { UserInfoDto } from '../dtos/auth.dto';

@ApiTags('认证鉴权')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(LoginDto),
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: BaseApiErrorResponse })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: '用户当前信息' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserInfoDto),
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: BaseApiErrorResponse })
  @Get('info')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async info(@Req() req: any): Promise<any> {
    const data = await this.authService.info(req.user.id);
    return { data };
  }
}