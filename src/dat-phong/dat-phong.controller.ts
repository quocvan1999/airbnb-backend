import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { DatPhongService } from './dat-phong.service';
import { ApiHeader, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { DatPhongDto } from './dto/dat-phong.dto';
import { CreateDatPhongDto } from './dto/create-dat-phong.dto';

@Controller('dat-phong')
export class DatPhongController {
  constructor(private readonly datPhongService: DatPhongService) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiHeader({ name: 'token', required: true })
  async getAllBooking(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const formatPage = page ? Number(page) : 1;
      const formatSize = limit ? Number(limit) : 10;
      const bookings: { data: DatPhongDto[]; total: number } | string =
        await this.datPhongService.getAllBooking(formatPage, formatSize);

      if (typeof bookings === 'string') {
        switch (bookings) {
          case 'NOT_FOUND':
            return res.status(HttpStatus.NOT_FOUND).json({
              statusCode: HttpStatus.NOT_FOUND,
              content: {
                message: 'Lấy danh sách đặt phòng không thành công',
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
            message: 'Lấy danh sách đặt phòng thành công',
            data: bookings.data,
            total: bookings.total,
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
  async createBooking(
    @Body() body: CreateDatPhongDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const createBooking: string = await this.datPhongService.createBooking(
        body,
        req,
      );

      switch (createBooking) {
        case 'ROOM_NOT_FOUND':
          return res.status(HttpStatus.NOT_FOUND).json({
            statusCode: HttpStatus.NOT_FOUND,
            content: {
              message: 'Phòng không tồn tại',
            },
            timestamp: new Date().toISOString(),
          });
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
        case 'INTERNAL_SERVER_ERROR':
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            content: {
              message: 'Đặt phòng không thành công',
            },
            timestamp: new Date().toISOString(),
          });
        case 'CREATED':
          return res.status(HttpStatus.CREATED).json({
            statusCode: HttpStatus.CREATED,
            content: {
              message: 'Đặt phòng thành công',
            },
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

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiHeader({ name: 'token', required: true })
  async getCommentsById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const booking: DatPhongDto | string =
        await this.datPhongService.getCommentsById(Number(id));

      if (typeof booking === 'string') {
        switch (booking) {
          case 'NOT_FOUND':
            return res.status(HttpStatus.NOT_FOUND).json({
              statusCode: HttpStatus.NOT_FOUND,
              content: {
                message: 'Không tìm thấy đặt phòng',
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
            message: 'Lấy thông tin đặt phòng thành công',
            data: booking,
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
}
