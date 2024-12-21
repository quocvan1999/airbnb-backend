import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ViTriService } from './vi-tri.service';
import { ApiQuery } from '@nestjs/swagger';
import { ViTriDto } from './dto/vi-tri.dto';
import { Response } from 'express';

@Controller('vi-tri')
export class ViTriController {
  constructor(private readonly viTriService: ViTriService) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  async getLocation(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('keyword') keyword: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const formatPage = page ? Number(page) : 1;
      const formatSize = limit ? Number(limit) : 10;

      const locations: { data: ViTriDto[]; total: number } | string =
        await this.viTriService.getLocation(formatPage, formatSize, keyword);

      if (typeof locations === 'string') {
        switch (locations) {
          case 'NOT_FOUND':
            return res.status(HttpStatus.NOT_FOUND).json({
              statusCode: HttpStatus.NOT_FOUND,
              content: {
                message: 'Lấy danh sách vị trí không thành công',
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
            data: locations.data,
            total: locations.total,
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
