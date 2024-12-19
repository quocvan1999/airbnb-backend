import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateBinhLuanDto } from './create-binh-luan.dto';

export class UpdateBinhLuanDto extends PartialType(
  OmitType(CreateBinhLuanDto, ['ma_phong'] as const),
) {}
