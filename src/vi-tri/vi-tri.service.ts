import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ViTriDto } from './dto/vi-tri.dto';
import { CreateViTriDto } from './dto/create-vi-tri.dto';
import { UpdateViTriDto } from './dto/update-vi-tri.dto';
import { join } from 'path';
import { unlink } from 'fs/promises';

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

  async createUser(body: CreateViTriDto, req: Request): Promise<string> {
    try {
      const { ten_vi_tri, tinh_thanh, quoc_gia } = body;

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

      const create = await this.prisma.viTri.create({
        data: {
          ten_vi_tri,
          tinh_thanh,
          quoc_gia,
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

  async getDetailLocation(id: number): Promise<ViTriDto | string> {
    try {
      const location: ViTriDto = await this.prisma.viTri.findUnique({
        where: {
          id,
        },
      });

      if (!location) {
        return 'NOT_FOUND';
      }

      return location;
    } catch (error) {
      return 'Internal Server Error';
    }
  }

  async updateLocation(
    body: UpdateViTriDto,
    id: number,
    req: Request,
  ): Promise<string> {
    try {
      const { ten_vi_tri, tinh_thanh, quoc_gia } = body;

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

      const update = await this.prisma.viTri.update({
        where: {
          id,
        },
        data: {
          ten_vi_tri,
          tinh_thanh,
          quoc_gia,
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

  async deleteLocation(id: number, req: Request): Promise<string> {
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

      const deleteLocation = await this.prisma.viTri.delete({
        where: {
          id,
        },
      });

      if (!deleteLocation) {
        return 'INTERNAL_SERVER_ERROR';
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

      const location: ViTriDto = await this.prisma.viTri.findUnique({
        where: {
          id,
        },
      });

      if (!location) {
        await unlink(file.path);
        return 'NOT_FOUND';
      }

      const update = await this.prisma.viTri.update({
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

      return 'UPDATED';
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
