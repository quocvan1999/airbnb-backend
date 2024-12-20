import { PartialType } from '@nestjs/swagger';
import { CreateNguoiDungDto } from './create-nguoi-dung.dto';

export class UpdateNguoiDungDto extends PartialType(CreateNguoiDungDto) {}
