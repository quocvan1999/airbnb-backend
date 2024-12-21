import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NguoiDungDto } from './dto/nguoi-dung.dto';
import { CreateNguoiDungDto } from './dto/create-nguoi-dung.dto';
import * as bcrypt from 'bcrypt';

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
        },
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
}
