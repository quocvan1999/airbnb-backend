import { PartialType } from '@nestjs/swagger';
import { CreateDatPhongDto } from './create-dat-phong.dto';

export class UpdateDatPhongDto extends PartialType(CreateDatPhongDto) {}
