import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ViTriDto } from './dto/vi-tri.dto';

@Injectable()
export class ViTriService {
  prisma = new PrismaClient();

  async getLocation(
    page: number,
    limit: number,
    keyword: string,
  ): Promise<{ data: ViTriDto[]; total: number } | string> {
    try {
      const locations: ViTriDto[] = await this.prisma.viTri.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: {
          ten_vi_tri: {
            contains: keyword,
          },
        },
      });

      if (!locations) {
        return 'NOT_FOUND';
      }

      const total: number = await this.prisma.viTri.count({
        where: {
          ten_vi_tri: {
            contains: keyword,
          },
        },
      });

      return { data: locations, total };
    } catch (error) {
      return 'Internal Server Error';
    }
  }
}
