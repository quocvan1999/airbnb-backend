import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { NguoiDungService } from './nguoi-dung.service';
import { ApiHeader, ApiQuery } from '@nestjs/swagger';
import { NguoiDungDto } from './dto/nguoi-dung.dto';
import { CreateNguoiDungDto } from './dto/create-nguoi-dung.dto';

@Controller('nguoi-dung')
export class NguoiDungController {
  constructor(private readonly nguoiDungService: NguoiDungService) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiHeader({ name: 'token', required: true })
  async getNguoiDung(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const formatPage = page ? Number(page) : 1;
      const formatSize = limit ? Number(limit) : 10;

      const users: { data: NguoiDungDto[]; total: number } | string =
        await this.nguoiDungService.getNguoiDung(formatPage, formatSize);

      if (typeof users === 'string') {
        switch (users) {
          case 'NOT_FOUND':
            return res.status(HttpStatus.NOT_FOUND).json({
              statusCode: HttpStatus.NOT_FOUND,
              content: {
                message: 'Lấy danh sách người dùng không thành công',
              },
              timestamp: new Date().toISOString(),
            });
          default:
            break;
        }
      } else {
        return res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          content: {
            message: 'Lấy danh sách người dùng thành công',
            data: users.data,
            total: users.total,
            page: formatPage,
            limit: formatSize,
          },
          timestamp: new Date().toISOString(),
        });
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

  @Post()
  @ApiHeader({ name: 'token', required: true })
  async createUser(
    @Body() body: CreateNguoiDungDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const register: string = await this.nguoiDungService.createUser(body, req);

      switch (register) {
        case 'ID_NOT_FOUND':
          return res.status(HttpStatus.NOT_FOUND).json({
            statusCode: HttpStatus.NOT_FOUND,
            content: {
              message: 'Không lấy được id người dùng',
            },
            timestamp: new Date().toISOString(),
          });
        case 'USER_NOT_FOUND':
          return res.status(HttpStatus.NOT_FOUND).json({
            statusCode: HttpStatus.NOT_FOUND,
            content: {
              message: 'Người dùng không tồn tại',
            },
            timestamp: new Date().toISOString(),
          });
        case 'FORBIDDEN':
          return res.status(HttpStatus.FORBIDDEN).json({
            statusCode: HttpStatus.FORBIDDEN,
            content: { message: 'Chỉ có Admin mới được thêm mới tài khoản' },
            timestamp: new Date().toISOString(),
          });
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
