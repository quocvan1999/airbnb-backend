import { Injectable } from '@nestjs/common';
import { DatPhongDto } from './dto/dat-phong.dto';
import { PrismaClient } from '@prisma/client';
import { CreateDatPhongDto } from './dto/create-dat-phong.dto';
import { UpdateDatPhongDto } from './dto/update-dat-phong.dto';

@Injectable()
export class DatPhongService {
  prisma = new PrismaClient();

  async getAllBooking(
    page: number,
    limit: number,
  ): Promise<{ data: DatPhongDto[]; total: number } | string> {
    try {
      const bookings: DatPhongDto[] = await this.prisma.datPhong.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });

      if (!bookings) {
        return 'NOT_FOUND';
      }

      const totalComment: number = await this.prisma.datPhong.count();

      return {
        data: bookings,
        total: totalComment,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createBooking(body: CreateDatPhongDto, req: Request): Promise<string> {
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

      const create = await this.prisma.datPhong.create({
        data: {
          ma_phong: Number(body.ma_phong),
          ngay_den: body.ngay_den,
          ngay_di: body.ngay_di,
          so_luong_khach: Number(body.so_luong_khach),
          ma_nguoi_dat: Number(id),
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

  async getCommentsById(id: number): Promise<DatPhongDto | string> {
    try {
      const booking = await this.prisma.datPhong.findUnique({
        where: { id },
      });

      if (!booking) {
        return 'NOT_FOUND';
      }

      return booking;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateBooking(
    body: UpdateDatPhongDto,
    id: number,
    req: Request,
  ): Promise<string> {
    try {
      const checkBooking = await this.prisma.datPhong.findUnique({
        where: { id },
      });

      if (!checkBooking) {
        return 'BOOKING_NOT_FOUND';
      }

      const checkRoom = await this.prisma.phong.findUnique({
        where: { id: Number(checkBooking.ma_phong) },
      });

      if (!checkRoom) {
        return 'ROOM_NOT_FOUND';
      }

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

      const update = await this.prisma.datPhong.update({
        where: { id },
        data: {
          ngay_den: body.ngay_den,
          ngay_di: body.ngay_di,
          so_luong_khach: Number(body.so_luong_khach),
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

  async deleteBooking(id: number, req: Request): Promise<string> {
    try {
      const checkBooking = await this.prisma.datPhong.findUnique({
        where: { id },
      });

      if (!checkBooking) {
        return 'BOOKING_NOT_FOUND';
      }

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

      const deleteBooking = await this.prisma.datPhong.delete({
        where: { id },
      });

      if (!deleteBooking) {
        return 'INTERNAL_SERVER_ERROR';
      }

      return 'DELETED';
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
