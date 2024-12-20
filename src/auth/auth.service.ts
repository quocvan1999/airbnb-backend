import { Injectable } from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignUpDto } from './dto/signup.dto';
import { parse } from 'date-fns';

@Injectable()
export class AuthService {
  prisma = new PrismaClient();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signin(
    body: SigninDto,
  ): Promise<
    { statusCode: string; token: string; accessToken: string } | string
  > {
    try {
      const { email, pass_word } = body;

      const checkUser = await this.prisma.nguoiDung.findUnique({
        where: { email },
      });

      if (!checkUser) {
        return 'NOT_FOUND';
      }

      let checkPass = bcrypt.compareSync(pass_word, checkUser.pass_word);

      if (!checkPass) {
        return 'UNAUTHORIZED';
      }

      const token = this.jwtService.sign(
        { data: { id: checkUser.id } },
        {
          expiresIn: this.configService.get<string>(
            'JWT_LOGIN_TOKEN_EXPIRES_IN',
          ),
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );

      const accessToken = this.jwtService.sign(
        { data: { id: checkUser.id } },
        {
          expiresIn: this.configService.get<string>(
            'JWT_ACCESS_TOKEN_EXPIRES_IN',
          ),
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );

      return { statusCode: 'OK', token, accessToken };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async signup(body: SignUpDto): Promise<string> {
    try {
      const { name, email, pass_word, phone, birth_day, gender } = body;

      const checkUser = await this.prisma.nguoiDung.findUnique({
        where: { email },
      });

      if (checkUser) {
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
          role: 'User',
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
}
