import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SigninDto {
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @ApiProperty()
  pass_word: string;
}
