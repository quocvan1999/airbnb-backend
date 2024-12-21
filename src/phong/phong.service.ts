import { Injectable } from '@nestjs/common';
import { Phong, PrismaClient } from '@prisma/client';
import { PhongDto } from './dto/phong.dto';

@Injectable()
export class PhongService {
  prisma = new PrismaClient();

  async getRooms(
    page: number,
    limit: number,
    keyword: string,
  ): Promise<{ data: PhongDto[]; total: number } | string> {
    try {
      const rooms: PhongDto[] = await this.prisma.phong.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: {
          ten_phong: {
            contains: keyword,
          },
        },
      });

      if (!rooms) {
        return 'NOT_FOUND';
      }

      const total: number = await this.prisma.phong.count({
        where: {
          ten_phong: {
            contains: keyword,
          },
        },
      });

      return { data: rooms, total };
    } catch (error) {
      return 'Internal Server Error';
    }
  }
}
