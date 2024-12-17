import { Module } from '@nestjs/common';
import { BinhLuanService } from './binh-luan.service';
import { BinhLuanController } from './binh-luan.controller';

@Module({
  controllers: [BinhLuanController],
  providers: [BinhLuanService],
})
export class BinhLuanModule {}
