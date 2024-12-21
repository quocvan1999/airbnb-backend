import { Injectable } from '@nestjs/common';
import { Phong, PrismaClient } from '@prisma/client';
import { PhongDto } from './dto/phong.dto';
import { CreatePhongDto } from './dto/create-phong.dto';

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

  async createRoom(body: CreatePhongDto, req: Request): Promise<string> {
    try {
      const {
        ten_phong,
        khach,
        phong_ngu,
        giuong,
        phong_tam,
        mo_ta,
        gia_tien,
        may_giat,
        ban_la,
        tivi,
        dieu_hoa,
        wifi,
        bep,
        do_xe,
        ho_boi,
        ban_ui,
      } = body;

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

      if (checkUser.role !== 'Admin') {
        return 'FORBIDDEN';
      }

      const create = await this.prisma.phong.create({
        data: {
          ten_phong,
          khach,
          phong_ngu,
          giuong,
          phong_tam,
          mo_ta,
          gia_tien,
          may_giat,
          ban_la,
          tivi,
          dieu_hoa,
          wifi,
          bep,
          do_xe,
          ho_boi,
          ban_ui,
          hinh_anh: '',
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
