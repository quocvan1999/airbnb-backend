import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateNguoiDungDto } from './create-nguoi-dung.dto';

export class UpdateNguoiDungDto extends PartialType(
  OmitType(CreateNguoiDungDto, ['email', 'pass_word'] as const),
) {}
