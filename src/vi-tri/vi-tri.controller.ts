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
import { ViTriService } from './vi-tri.service';
import { ApiBody, ApiConsumes, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { ViTriDto } from './dto/vi-tri.dto';
import { Response } from 'express';
import { CreateViTriDto } from './dto/create-vi-tri.dto';
import { UpdateViTriDto } from './dto/update-vi-tri.dto';
import { FileUploadDto } from 'src/shared/dto/upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/shared/upload.service';
import { FileValidationInterceptor } from 'src/middlewares/upload.middleware';

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

  @Post()
  @ApiHeader({ name: 'token', required: true })
  async createLocation(
    @Body() body: CreateViTriDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const location: string = await this.viTriService.createUser(body, req);

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
            content: { message: 'Chỉ có Admin mới được thêm vị trí' },
            timestamp: new Date().toISOString(),
          });
        case 'INTERNAL_SERVER_ERROR':
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            content: { message: 'Thêm mới vị trí không thành công' },
            timestamp: new Date().toISOString(),
          });
        case 'CREATED':
          return res.status(HttpStatus.CREATED).json({
            statusCode: HttpStatus.CREATED,
            content: { message: 'Thêm mới vị trí thành công' },
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

  @Get('/:id')
  async getDetailLocation(
    @Query('id') id: number,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const location: ViTriDto | string =
        await this.viTriService.getDetailLocation(Number(id));

      switch (location) {
        case 'NOT_FOUND':
          return res.status(HttpStatus.NOT_FOUND).json({
            statusCode: HttpStatus.NOT_FOUND,
            content: {
              message: 'Vị trí không tồn tại',
            },
            timestamp: new Date().toISOString(),
          });
        default:
          return res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            content: {
              message: 'Lấy thông tin vị trí thành công',
              data: location,
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
  async updateLocation(
    @Body() body: UpdateViTriDto,
    @Query('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const location: string = await this.viTriService.updateLocation(
        body,
        Number(id),
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
            content: { message: 'Chỉ có Admin mới được sửa vị trí' },
            timestamp: new Date().toISOString(),
          });
        case 'INTERNAL_SERVER_ERROR':
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            content: { message: 'Sửa vị trí không thành công' },
            timestamp: new Date().toISOString(),
          });
        case 'UPDATED':
          return res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            content: { message: 'Sửa vị trí thành công' },
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
  async deleteLocation(
    @Query('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const location: string = await this.viTriService.deleteLocation(
        Number(id),
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
            content: { message: 'Chỉ có Admin mới được xóa vị trí' },
            timestamp: new Date().toISOString(),
          });
        case 'INTERNAL_SERVER_ERROR':
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            content: { message: 'Xóa vị trí không thành công' },
            timestamp: new Date().toISOString(),
          });
        case 'DELETED':
          return res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            content: { message: 'Xóa vị trí thành công' },
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

  @Post('/upload-hinh-vi-tri')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
    required: true,
  })
  @UseInterceptors(
    FileInterceptor('hinhAnh', { storage: storage() }),
    new FileValidationInterceptor('./public/imgs/locations'),
  )
  @ApiHeader({ name: 'token', required: true })
  @ApiQuery({ name: 'maViTri', required: true, type: Number })
  async uploadThumbnail(
    @UploadedFile() file: Express.Multer.File,
    @Query('maViTri') maViTri: number,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const location: string = await this.viTriService.uploadImage(
        Number(maViTri),
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
            content: { message: 'Chỉ có Admin mới được thêm hình ảnh' },
            timestamp: new Date().toISOString(),
          });
        case 'NOT_FOUND':
          return res.status(HttpStatus.NOT_FOUND).json({
            statusCode: HttpStatus.NOT_FOUND,
            content: {
              message: 'Vị trí không tồn tại',
            },
            timestamp: new Date().toISOString(),
          });
        case 'INTERNAL_SERVER_ERROR':
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            content: { message: 'Thêm hình ảnh không thành công' },
            timestamp: new Date().toISOString(),
          });
        case 'UPDATED':
          return res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            content: { message: 'Thêm hình ảnh thành công' },
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
