import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';

export class CreateDatPhongDto {
  @IsNotEmpty({ message: 'Mã phòng không được để trống' })
  @ApiProperty()
  ma_phong: number;

  @IsNotEmpty({ message: 'Ngày đến không được để trống' })
  @ApiProperty()
  ngay_den: Date;

  @IsNotEmpty({ message: 'Ngày đi không được để trống' })
  @ApiProperty()
  ngay_di: Date;

  @IsNotEmpty({ message: 'Số lượng khách không được để trống' })
  @Min(1, { message: 'Số lượng khách phải lớn hơn 0' })
  @ApiProperty()
  so_luong_khach: number;
}
