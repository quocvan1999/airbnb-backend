import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import * as multer from 'multer';

@Injectable()
export class FileValidationMiddleware implements NestMiddleware {
  private upload = multer({
    limits: { fileSize: 1024 * 1024 * 2 },
    fileFilter: (
      req: any,
      file: Express.Multer.File,
      callback: (error: Error | null, acceptFile: boolean) => void,
    ) => {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return callback(
          new Error(
            'Định dạng file không hợp lệ, chỉ hỗ trợ file định jpeg, jpg, png.',
          ),
          false,
        );
      }
      callback(null, true);
    },
  }).single('hinhAnh');

  use(req: any, res: any, next: () => void) {
    this.upload(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(HttpStatus.BAD_REQUEST).json({
            statusCode: HttpStatus.BAD_REQUEST,
            content: {
              message: 'Dung lượng file vượt quá giới hạn cho phép (2MB).',
            },
            timestamp: new Date().toISOString(),
          });
        }
      } else if (err) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          content: {
            message:
              'Định dạng file không hợp lệ, chỉ hỗ trợ file định jpeg, jpg, png.',
          },
          timestamp: new Date().toISOString(),
        });
      }

      if (!req.file) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          content: { message: 'Không tìm thấy file nào trong yêu cầu.' },
          timestamp: new Date().toISOString(),
        });
      }

      next();
    });
  }
}
