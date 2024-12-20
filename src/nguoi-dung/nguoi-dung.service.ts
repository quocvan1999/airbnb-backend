import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NguoiDungDto } from './dto/nguoi-dung.dto';

@Injectable()
export class NguoiDungService {
  prisma = new PrismaClient();

  async getNguoiDung(
    page: number,
    limit: number,
  ): Promise<{ data: NguoiDungDto[]; total: number } | string> {
    try {
      const users: NguoiDungDto[] = await this.prisma.nguoiDung.findMany({
        take: limit,
        skip: (page - 1) * limit,
      });

      if (!users) {
        return 'NOT_FOUND';
      }

      const total: number = await this.prisma.nguoiDung.count();

      return { data: users, total };
    } catch (error) {
      return 'Internal Server Error';
    }
  }
}
