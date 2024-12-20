import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export class SignUpDto {
  @IsNotEmpty({ message: 'Tên không được để trống' })
  @ApiProperty()
  name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @ApiProperty()
  pass_word: string;

  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @ApiProperty()
  phone: string;

  @IsNotEmpty({ message: 'Ngày sinh không được để trống' })
  @ApiProperty()
  birth_day: Date;

  @ApiProperty({
    enum: Gender,
    default: Gender.Other,
  })
  @IsEnum(Gender, { message: 'Gender chỉ có thể là Male, Female hoặc Other' })
  @IsOptional()
  gender: Gender = Gender.Other;
}
