import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export class CreatePhongDto {
  @IsNotEmpty({ message: 'Tên phòng không được để trống' })
  @ApiProperty()
  ten_phong: string;

  @IsNotEmpty({ message: 'Số lượng khách không được để trống' })
  @IsNumber({}, { message: 'Số lượng khách phải là một số' })
  @ApiProperty()
  khach: number;

  @IsNotEmpty({ message: 'Số lượng phòng ngủ không được để trống' })
  @IsNumber({}, { message: 'Số lượng phòng ngủ phải là một số' })
  @ApiProperty()
  phong_ngu: number;

  @IsNotEmpty({ message: 'Số lượng giường không được để trống' })
  @IsNumber({}, { message: 'Số lượng giường phải là một số' })
  @ApiProperty()
  giuong: number;

  @IsNotEmpty({ message: 'Số lượng phòng tắm không được để trống' })
  @IsNumber({}, { message: 'Số lượng phòng tắm phải là một số' })
  @ApiProperty()
  phong_tam: number;

  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  @IsString({ message: 'Mô tả phải là một chuỗi' })
  @ApiProperty()
  mo_ta: string;

  @IsNotEmpty({ message: 'Giá tiền không được để trống' })
  @IsNumber({}, { message: 'Giá tiền phải là một số' })
  @ApiProperty()
  gia_tien: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false, default: false })
  may_giat?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false, default: false })
  ban_la?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false, default: false })
  tivi?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false, default: false })
  dieu_hoa?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false, default: false })
  wifi?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false, default: false })
  bep?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false, default: false })
  do_xe?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false, default: false })
  ho_boi?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false, default: false })
  ban_ui?: boolean;
}
