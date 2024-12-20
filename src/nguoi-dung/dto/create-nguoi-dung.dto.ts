import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

enum Role {
  User = 'User',
  Admin = 'Admin',
}

export class CreateNguoiDungDto {
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

  @ApiProperty({
    enum: Role,
    default: Role.User,
  })
  @IsEnum(Role, { message: 'Role chỉ có thể là User hoặc Admin' })
  @IsOptional()
  role: Role = Role.User;
}
