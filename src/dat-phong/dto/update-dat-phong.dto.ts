import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateDatPhongDto } from './create-dat-phong.dto';

export class UpdateDatPhongDto extends PartialType(
  OmitType(CreateDatPhongDto, ['ma_phong'] as const),
) {}
