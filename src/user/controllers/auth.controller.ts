import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiConsumes,
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
import { RegisterCodeDTO, RegisterSMSDTO, UserInfoDto } from '../dtos/auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadDto } from '../dtos/upload.dto';

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

  @ApiOperation({ summary: '获取验证码' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserInfoDto),
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: BaseApiErrorResponse })
  @Post('registerCode')
  async registerCode(@Body() registerCodeDto: RegisterCodeDTO) {
    await this.authService.registerCode(registerCodeDto);
    return {
      message: '生成验证码',
    };
  }

  @ApiOperation({ summary: '获取图形验证码' })
  @Get('captcha')
  async getCaptcha() {
    const data = await this.authService.getCaptcha();
    return {
      data,
    };
  }

  @ApiOperation({ summary: '短信用户注册/登录' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(RegisterSMSDTO),
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: BaseApiErrorResponse })
  @Post('registerBySMS')
  async registerBySMS(@Body() registerSMSDTO: RegisterSMSDTO) {
    return await this.authService.registerBySMS(registerSMSDTO);
  }
}
