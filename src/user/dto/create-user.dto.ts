import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: '18712312345' })
  @IsNotEmpty()
  @Matches(/^1\d{10}$/g, { message: '请输入手机号' })
  readonly phone: string;

  @ApiProperty({ example: 'dome' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @Length(6, 10)
  passowrd: string;

  @ApiProperty({ example: '1@1.com' })
  @IsEmail()
  email: string;
}
