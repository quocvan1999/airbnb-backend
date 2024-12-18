import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max, Min } from 'class-validator';

export class CreateBinhLuanDto {
  @IsNotEmpty({ message: 'Mã phòng không được để trống' })
  @ApiProperty()
  ma_phong: number;

  @IsNotEmpty({ message: 'Ngày bình luận không được để trống' })
  @ApiProperty()
  ngay_binh_luan: Date;

  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  @ApiProperty()
  noi_dung: string;

  @IsNotEmpty({ message: 'Số sao không được để trống' })
  @Min(1, { message: 'Số sao phải từ 1 đến 5' })
  @Max(5, { message: 'Số sao phải từ 1 đến 5' })
  @ApiProperty()
  sao_binh_luan: number;
}
