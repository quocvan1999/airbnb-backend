import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NguoiDungDto } from './dto/nguoi-dung.dto';
import { CreateNguoiDungDto } from './dto/create-nguoi-dung.dto';
import * as bcrypt from 'bcrypt';
import { UpdateNguoiDungDto } from './dto/update-nguoi-dung.dto';
import { join } from 'path';
import { unlink } from 'fs/promises';

@Injectable()
export class NguoiDungService {
  prisma = new PrismaClient();

  async getNguoiDung(
    page: number,
    limit: number,
    keyword: string,
  ): Promise<{ data: NguoiDungDto[]; total: number } | string> {
    try {
      const users: NguoiDungDto[] = await this.prisma.nguoiDung.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: {
          name: {
            contains: keyword,
          },
        },
        select: {
          id: true,
          name: true,
          phone: true,
          birth_day: true,
          gender: true,
          role: true,
          avatar: true,
        },
      });

      if (!users) {
        return 'NOT_FOUND';
      }

      const total: number = await this.prisma.nguoiDung.count({
        where: {
          name: {
            contains: keyword,
          },
        },
      });

      return { data: users, total };
    } catch (error) {
      return 'Internal Server Error';
    }
  }

  async createUser(body: CreateNguoiDungDto, req: Request): Promise<string> {
    try {
      const { name, email, pass_word, phone, birth_day, gender, role } = body;

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

      const checNewkUser = await this.prisma.nguoiDung.findUnique({
        where: { email },
      });

      if (checNewkUser) {
        return 'CONFLICT';
      }

      const newPassword = bcrypt.hashSync(pass_word, 10);

      const register = await this.prisma.nguoiDung.create({
        data: {
          name,
          email,
          pass_word: newPassword,
          phone,
          birth_day,
          gender,
          role,
        },
      });

      if (!register) {
        return 'INTERNAL_SERVER_ERROR';
      }

      return 'CREATED';
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteUser(id: number, req: Request): Promise<string> {
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

      if (id === Number(checkUser.id)) {
        return 'FORBIDDEN';
      }

      const removeUser = await this.prisma.nguoiDung.delete({
        where: { id },
      });

      if (!removeUser) {
        return 'INTERNAL_SERVER_ERROR';
      }

      return 'DELETED';
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUserById(id: number): Promise<NguoiDungDto | string> {
    try {
      const user = await this.prisma.nguoiDung.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          phone: true,
          birth_day: true,
          gender: true,
          role: true,
          avatar: true,
        },
      });

      if (!user) {
        return 'NOT_FOUND';
      }

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateUser(body: UpdateNguoiDungDto, id: number): Promise<string> {
    try {
      const { name, phone, birth_day, gender, role } = body;

      const checkUser = await this.prisma.nguoiDung.findUnique({
        where: { id },
      });

      if (!checkUser) {
        return 'NOT_FOUND';
      }

      const updateUser = await this.prisma.nguoiDung.update({
        where: { id },
        data: {
          name,
          phone,
          birth_day,
          gender,
          role,
        },
      });

      if (!updateUser) {
        return 'INTERNAL_SERVER_ERROR';
      }

      return 'UPDATED';
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async uploadImage(file: Express.Multer.File, req: Request): Promise<string> {
    try {
      const { id } = req['user'].data;

      if (!id) {
        await unlink(file.path);
        return 'ID_NOT_FOUND';
      }

      const checkUser = await this.prisma.nguoiDung.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!checkUser) {
        await unlink(file.path);
        return 'USER_NOT_FOUND';
      }

      const update = await this.prisma.nguoiDung.update({
        where: {
          id: Number(id),
        },
        data: {
          avatar: file.path,
        },
      });

      if (!update) {
        await unlink(file.path);
        return 'INTERNAL_SERVER_ERROR';
      }

      return 'UPLOADED';
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
