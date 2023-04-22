import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: '18712312345' })
  readonly phone: string;

  @ApiProperty({ example: 'dome' })
  name: string;

  @ApiProperty({ example: '123456' })
  passowrd: string;

  @ApiProperty({ example: '1@1.com' })
  email: string;
}
