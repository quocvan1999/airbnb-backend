import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { Response } from 'express';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signin(
    @Body() body: SigninDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const login:
        | { statusCode: string; token: string; accessToken: string }
        | string = await this.authService.signin(body);

      if (typeof login === 'string') {
        switch (login) {
          case 'NOT_FOUND':
            return res.status(HttpStatus.NOT_FOUND).json({
              statusCode: HttpStatus.NOT_FOUND,
              content: { message: 'Tài khoản không tồn tại' },
              timestamp: new Date().toISOString(),
            });
          case 'UNAUTHORIZED':
            return res.status(HttpStatus.UNAUTHORIZED).json({
              statusCode: HttpStatus.UNAUTHORIZED,
              content: { message: 'Mật khẩu không chính xác' },
              timestamp: new Date().toISOString(),
            });
          default:
            break;
        }
      } else {
        switch (login.statusCode) {
          case 'OK':
            res.cookie('accessToken', login.accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(HttpStatus.OK).json({
              statusCode: HttpStatus.OK,
              content: { message: 'Đăng nhập thành công', token: login.token },
              timestamp: new Date().toISOString(),
            });
          default:
            break;
        }
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        content: { message: 'Internal Server Error' },
        error: error?.message || 'Internal Server Error',
        timestamp: new Date().toISOString(),
      });
    }
  }

  @Post('/signup')
  async signup(
    @Body() body: SignUpDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const register = await this.authService.signup(body);

      switch (register) {
        case 'CONFLICT':
          return res.status(HttpStatus.CONFLICT).json({
            statusCode: HttpStatus.CONFLICT,
            content: { message: 'Tài khoản đã tồn tại' },
            timestamp: new Date().toISOString(),
          });
        case 'INTERNAL_SERVER_ERROR':
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            content: { message: 'Thêm mới tài khoản không thành công' },
            timestamp: new Date().toISOString(),
          });
        case 'CREATED':
          return res.status(HttpStatus.CREATED).json({
            statusCode: HttpStatus.CREATED,
            content: { message: 'Thêm mới tài khoản thành công' },
            timestamp: new Date().toISOString(),
          });
        default:
          break;
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        content: { message: 'Internal Server Error' },
        error: error?.message || 'Internal Server Error',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
