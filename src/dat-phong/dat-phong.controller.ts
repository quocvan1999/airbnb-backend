import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { DatPhongService } from './dat-phong.service';
import { ApiHeader, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { DatPhongDto } from './dto/dat-phong.dto';
import { CreateDatPhongDto } from './dto/create-dat-phong.dto';
import { UpdateDatPhongDto } from './dto/update-dat-phong.dto';

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

  @Put(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiHeader({ name: 'token', required: true })
  async updateBooking(
    @Body() body: UpdateDatPhongDto,
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const update: string = await this.datPhongService.updateBooking(
        body,
        Number(id),
        req,
      );

      switch (update) {
        case 'BOOKING_NOT_FOUND':
          return res.status(HttpStatus.NOT_FOUND).json({
            statusCode: HttpStatus.NOT_FOUND,
            content: {
              message: 'Đặt phòng không tồn tại',
            },
            timestamp: new Date().toISOString(),
          });
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
              message: 'Cập nhật đặt phòng không thành công',
            },
            timestamp: new Date().toISOString(),
          });
        case 'UPDATED':
          return res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            content: {
              message: 'Cập nhật đặt phòng thành công',
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

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiHeader({ name: 'token', required: true })
  async deleteBooking(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const deleted: string = await this.datPhongService.deleteBooking(
        Number(id),
        req,
      );

      switch (deleted) {
        case 'BOOKING_NOT_FOUND':
          return res.status(HttpStatus.NOT_FOUND).json({
            statusCode: HttpStatus.NOT_FOUND,
            content: {
              message: 'Đặt phòng không tồn tại',
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
              message: 'Xóa đặt phòng không thành công',
            },
            timestamp: new Date().toISOString(),
          });
        case 'DELETED':
          return res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            content: {
              message: 'Xóa đặt phòng thành công',
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

  @Get('/lay-theo-nguoi-dung/:MaNguoiDung')
  @ApiParam({ name: 'MaNguoiDung', type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiHeader({ name: 'token', required: true })
  async getBookingByUserId(
    @Param('MaNguoiDung') MaNguoiDung: string,
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const formatPage = page ? Number(page) : 1;
      const formatSize = limit ? Number(limit) : 10;
      const bookings: { data: DatPhongDto[]; total: number } | string =
        await this.datPhongService.getBookingByUserId(
          formatPage,
          formatSize,
          Number(MaNguoiDung),
          req,
        );

      if (typeof bookings === 'string') {
        switch (bookings) {
          case 'ID_NOT_FOUND':
            return res.status(HttpStatus.NOT_FOUND).json({
              statusCode: HttpStatus.NOT_FOUND,
              content: {
                message: 'Không lấy được id người dùng',
              },
              timestamp: new Date().toISOString(),
            });
          case 'PERMISSION_DENIED':
            return res.status(HttpStatus.FORBIDDEN).json({
              statusCode: HttpStatus.FORBIDDEN,
              content: {
                message: 'Không có quyền truy cập',
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
}
