import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PhongService } from './phong.service';
import { ApiBody, ApiConsumes, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { PhongDto } from './dto/phong.dto';
import { Response } from 'express';
import { CreatePhongDto } from './dto/create-phong.dto';
import { UpdatePhongDto } from './dto/update-phong.dto';
import { FileUploadDto } from 'src/shared/dto/upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/shared/upload.service';
import { FileValidationInterceptor } from 'src/middlewares/upload.middleware';

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

  @Post()
  @ApiHeader({ name: 'token', required: true })
  async createRoom(
    @Body() body: CreatePhongDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const create: string = await this.phongService.createRoom(body, req);

      switch (create) {
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
            content: { message: 'Chỉ có Admin mới được thêm mới phòng' },
            timestamp: new Date().toISOString(),
          });
        case 'INTERNAL_SERVER_ERROR':
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            content: { message: 'Thêm mới phòng không thành công' },
            timestamp: new Date().toISOString(),
          });
        case 'CREATED':
          return res.status(HttpStatus.CREATED).json({
            statusCode: HttpStatus.CREATED,
            content: { message: 'Thêm mới phòng thành công' },
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

  @Get('/lay-phong-theo-vi-tri')
  @ApiQuery({ name: 'maViTri', required: true, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  async getRoomsByLocation(
    @Query('maViTri') maViTri: number,
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const formatPage = page ? Number(page) : 1;
      const formatSize = limit ? Number(limit) : 10;

      const rooms: { data: PhongDto[]; total: number } | string =
        await this.phongService.getRoomsByLocation(
          formatPage,
          formatSize,
          Number(maViTri),
        );

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
          case 'LOCATION_NOT_FOUND':
            return res.status(HttpStatus.NOT_FOUND).json({
              statusCode: HttpStatus.NOT_FOUND,
              content: {
                message: 'Vị trí không tồn tại',
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

  @Get('/:id')
  @ApiQuery({ name: 'id', required: true, type: Number })
  async getRoomById(
    @Query('id') id: number,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const room: PhongDto | string = await this.phongService.getRoomById(
        Number(id),
      );

      if (typeof room === 'string') {
        switch (room) {
          case 'NOT_FOUND':
            return res.status(HttpStatus.NOT_FOUND).json({
              statusCode: HttpStatus.NOT_FOUND,
              content: {
                message: 'Phòng không tồn tại',
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
            message: 'Lấy phòng thành công',
            data: room,
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

  @Put('/:id')
  @ApiHeader({ name: 'token', required: true })
  async updateRoom(
    @Query('id') id: number,
    @Body() body: UpdatePhongDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const update: string = await this.phongService.updateRoom(
        Number(id),
        body,
        req,
      );

      switch (update) {
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
            content: { message: 'Chỉ có Admin mới được cập nhật phòng' },
            timestamp: new Date().toISOString(),
          });
        case 'INTERNAL_SERVER_ERROR':
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            content: { message: 'Cập nhật phòng không thành công' },
            timestamp: new Date().toISOString(),
          });
        case 'UPDATED':
          return res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            content: { message: 'Cập nhật phòng thành công' },
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

  @Delete('/:id')
  @ApiHeader({ name: 'token', required: true })
  async deleteRoom(
    @Query('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const deleted: string = await this.phongService.deleteRoom(
        Number(id),
        req,
      );

      switch (deleted) {
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
            content: { message: 'Chỉ có Admin mới được xóa phòng' },
            timestamp: new Date().toISOString(),
          });
        case 'NOT_FOUND':
          return res.status(HttpStatus.NOT_FOUND).json({
            statusCode: HttpStatus.NOT_FOUND,
            content: {
              message: 'Phòng không tồn tại',
            },
            timestamp: new Date().toISOString(),
          });
        case 'DELETED':
          return res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            content: { message: 'Xóa phòng thành công' },
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

  @Post('/upload-hinh-phong')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
    required: true,
  })
  @UseInterceptors(
      FileInterceptor('hinhAnh', { storage: storage() }),
      new FileValidationInterceptor('./public/imgs/rooms'),
    )
  @ApiHeader({ name: 'token', required: true })
  @ApiQuery({ name: 'maPhong', required: true, type: Number })
  async uploadThumbnail(
    @UploadedFile() file: Express.Multer.File,
    @Query('maPhong') maPhong: number,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const location: string = await this.phongService.uploadImage(
        Number(maPhong),
        file,
        req,
      );

      switch (location) {
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
            content: { message: 'Chỉ có Admin mới được cập nhật hình ảnh' },
            timestamp: new Date().toISOString(),
          });
        case 'NOT_FOUND':
          return res.status(HttpStatus.NOT_FOUND).json({
            statusCode: HttpStatus.NOT_FOUND,
            content: {
              message: 'Phòng không tồn tại',
            },
            timestamp: new Date().toISOString(),
          });
        case 'INTERNAL_SERVER_ERROR':
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            content: { message: 'Cập nhật hình ảnh không thành công' },
            timestamp: new Date().toISOString(),
          });
        case 'UPLOAD':
          return res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            content: { message: 'Cập nhật hình ảnh thành công' },
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
