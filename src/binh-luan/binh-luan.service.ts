import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { BinhLuanDto } from './dto/binh-luan.dto';

@Injectable()
export class BinhLuanService {
  prisma = new PrismaClient();

  async getComments(
    page: number,
    limit: number,
  ): Promise<{ data: BinhLuanDto[]; total: number } | string> {
    const comments: BinhLuanDto[] = await this.prisma.binhLuan.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    if (!comments) {
      return 'NOT_FOUND';
    }

    const totalComment: number = await this.prisma.binhLuan.count();

    return {
      data: comments,
      total: totalComment,
    };
  }
}
