import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { PhongService } from './phong.service';
import { ApiQuery } from '@nestjs/swagger';
import { PhongDto } from './dto/phong.dto';
import { Response } from 'express';

@Controller('phong')
export class PhongController {
  constructor(private readonly phongService: PhongService) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  async getRooms(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('keyword') keyword: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const formatPage = page ? Number(page) : 1;
      const formatSize = limit ? Number(limit) : 10;

      const rooms: { data: PhongDto[]; total: number } | string =
        await this.phongService.getRooms(formatPage, formatSize, keyword);

      if (typeof rooms === 'string') {
        switch (rooms) {
          case 'NOT_FOUND':
            return res.status(HttpStatus.NOT_FOUND).json({
              statusCode: HttpStatus.NOT_FOUND,
              content: {
                message: 'Lấy danh sách phòng không thành công',
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
            message: 'Lấy danh sách phòng thành công',
            data: rooms.data,
            total: rooms.total,
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
