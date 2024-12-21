import { PartialType } from '@nestjs/swagger';
import { CreateViTriDto } from './create-vi-tri.dto';

export class UpdateViTriDto extends PartialType(CreateViTriDto) {}
