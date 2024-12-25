import { Injectable } from '@nestjs/common';
import { Phong, PrismaClient } from '@prisma/client';
import { PhongDto } from './dto/phong.dto';
import { CreatePhongDto } from './dto/create-phong.dto';
import { UpdatePhongDto } from './dto/update-phong.dto';
import { join } from 'path';
import { unlink } from 'fs/promises';

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

  async getRoomsByLocation(
    page: number,
    limit: number,
    maViTri: number,
  ): Promise<{ data: PhongDto[]; total: number } | string> {
    try {
      const checkLocation = await this.prisma.viTri.findUnique({
        where: {
          id: maViTri,
        },
      });

      if (!checkLocation) {
        return 'LOCATION_NOT_FOUND';
      }

      const rooms: PhongDto[] = await this.prisma.phong.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: {
          ma_vi_tri: maViTri,
        },
      });

      if (!rooms) {
        return 'NOT_FOUND';
      }

      const total: number = await this.prisma.phong.count({
        where: {
          ma_vi_tri: maViTri,
        },
      });

      return { data: rooms, total };
    } catch (error) {
      return 'Internal Server Error';
    }
  }

  async getRoomById(id: number): Promise<PhongDto | string> {
    try {
      const room: PhongDto = await this.prisma.phong.findUnique({
        where: {
          id,
        },
      });

      if (!room) {
        return 'NOT_FOUND';
      }

      return room;
    } catch (error) {
      return 'Internal Server Error';
    }
  }

  async updateRoom(
    id: number,
    body: UpdatePhongDto,
    req: Request,
  ): Promise<string> {
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

      const { id: userId } = req['user'].data;

      if (!userId) {
        return 'ID_NOT_FOUND';
      }

      const checkUser = await this.prisma.nguoiDung.findUnique({
        where: {
          id: Number(userId),
        },
      });

      if (!checkUser) {
        return 'USER_NOT_FOUND';
      }

      if (checkUser.role !== 'Admin') {
        return 'FORBIDDEN';
      }

      const update = await this.prisma.phong.update({
        where: {
          id,
        },
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
        },
      });

      if (!update) {
        return 'INTERNAL_SERVER_ERROR';
      }

      return 'UPDATED';
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteRoom(id: number, req: Request): Promise<string> {
    try {
      const { id: userId } = req['user'].data;

      if (!userId) {
        return 'ID_NOT_FOUND';
      }

      const checkUser = await this.prisma.nguoiDung.findUnique({
        where: {
          id: Number(userId),
        },
      });

      if (!checkUser) {
        return 'USER_NOT_FOUND';
      }

      if (checkUser.role !== 'Admin') {
        return 'FORBIDDEN';
      }

      const deleteRoom = await this.prisma.phong.delete({
        where: {
          id,
        },
      });

      if (!deleteRoom) {
        return 'NOT_FOUND';
      }

      return 'DELETED';
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async uploadImage(
    id: number,
    file: Express.Multer.File,
    req: Request,
  ): Promise<string> {
    try {
      const { id: userId } = req['user'].data;

      if (!userId) {
        await unlink(file.path);
        return 'ID_NOT_FOUND';
      }

      const checkUser = await this.prisma.nguoiDung.findUnique({
        where: {
          id: Number(userId),
        },
      });

      if (!checkUser) {
        await unlink(file.path);
        return 'USER_NOT_FOUND';
      }

      if (checkUser.role !== 'Admin') {
        await unlink(file.path);
        return 'FORBIDDEN';
      }

      const room: PhongDto = await this.prisma.phong.findUnique({
        where: {
          id,
        },
      });

      if (!room) {
        await unlink(file.path);
        return 'NOT_FOUND';
      }

      const update = await this.prisma.phong.update({
        where: {
          id,
        },
        data: {
          hinh_anh: file.path,
        },
      });

      if (!update) {
        await unlink(file.path);
        return 'INTERNAL_SERVER_ERROR';
      }

      return 'UPLOAD';
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
