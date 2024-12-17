import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { BinhLuanService } from './binh-luan.service';
import { ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { BinhLuanDto } from './dto/binh-luan.dto';

@Controller('binh-luan')
export class BinhLuanController {
  constructor(private readonly binhLuanService: BinhLuanService) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  async getComments(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const formatPage = page ? Number(page) : 1;
      const formatSize = limit ? Number(limit) : 10;
      const comments: { data: BinhLuanDto[]; total: number } | string =
        await this.binhLuanService.getComments(formatPage, formatSize);

      if (typeof comments === 'string') {
        switch (comments) {
          case 'NOT_FOUND':
            return res.status(HttpStatus.NOT_FOUND).json({
              statusCode: HttpStatus.NOT_FOUND,
              content: {
                message: 'Lấy danh sách bình luận không thành công',
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
            message: 'Lấy danh sách bình luận thành công',
            data: comments.data,
            total: comments.total,
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
