import { PartialType } from '@nestjs/swagger';
import { CreatePhongDto } from './create-phong.dto';

export class UpdatePhongDto extends PartialType(CreatePhongDto) {}
