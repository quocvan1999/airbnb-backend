import {
  Controller,
  Get,
  Query,
  Res,
  HttpStatus,
  Post,
  Req,
  Body,
  Patch,
} from '@nestjs/common';
import { BinhLuanService } from './binh-luan.service';
import { ApiHeader, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { BinhLuanDto } from './dto/binh-luan.dto';
import { CreateBinhLuanDto } from './dto/create-binh-luan.dto';

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

  @Post()
  @ApiHeader({ name: 'token', required: true })
  async createComment(
    @Body() body: CreateBinhLuanDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const createComment: string = await this.binhLuanService.createComment(
        body,
        req,
      );

      switch (createComment) {
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
              message: 'Thêm bình luận không thành công',
            },
            timestamp: new Date().toISOString(),
          });
        case 'CREATED':
          return res.status(HttpStatus.CREATED).json({
            statusCode: HttpStatus.CREATED,
            content: {
              message: 'Thêm bình luận thành công',
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

  @Patch(':id')
  @ApiHeader({ name: 'token', required: true })
  async updateComment(
    @Body() body: CreateBinhLuanDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    return res.status(200);
  }
}
