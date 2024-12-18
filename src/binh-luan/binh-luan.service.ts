import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { BinhLuanDto } from './dto/binh-luan.dto';
import { CreateBinhLuanDto } from './dto/create-binh-luan.dto';

@Injectable()
export class BinhLuanService {
  prisma = new PrismaClient();

  async getComments(
    page: number,
    limit: number,
  ): Promise<{ data: BinhLuanDto[]; total: number } | string> {
    try {
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
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createComment(body: CreateBinhLuanDto, req: Request): Promise<string> {
    try {
      const checkRoom = await this.prisma.phong.findUnique({
        where: { id: Number(body.ma_phong) },
      });

      if (!checkRoom) {
        return 'ROOM_NOT_FOUND';
      }

      const { id } = req['user'].data;

      if (!id) {
        return 'ID_NOT_FOUND';
      }

      const checkUser = await this.prisma.nguoiDung.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!checkUser) {
        return 'USER_NOT_FOUND';
      }

      const create = await this.prisma.binhLuan.create({
        data: {
          ma_phong: body.ma_phong,
          ma_nguoi_binh_luan: Number(id),
          ngay_binh_luan: body.ngay_binh_luan,
          noi_dung: body.noi_dung,
          sao_binh_luan: Number(body.sao_binh_luan),
        },
      });

      if (!create) {
        return 'INTERNAL_SERVER_ERROR';
      }

      return 'CREATED';
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
