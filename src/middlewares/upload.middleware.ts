import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { extname } from 'path';
import { createWriteStream, existsSync, mkdirSync } from 'fs';

@Injectable()
export class FileValidationInterceptor implements NestInterceptor {
  constructor(private readonly destination: string) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const file = request.file;

    if (!file) {
      throw new HttpException(
        {
          success: false,
          message: 'No file provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new HttpException(
        {
          success: false,
          message: 'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSizeInBytes) {
      throw new HttpException(
        {
          success: false,
          message: 'File size exceeds 2MB limit.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!existsSync(this.destination)) {
      mkdirSync(this.destination, { recursive: true });
    }

    const uniqueName = `${Date.now()}${extname(file.originalname)}`;
    const filePath = `${this.destination}/${uniqueName}`;

    const writeStream = createWriteStream(filePath);
    writeStream.write(file.buffer);
    writeStream.end();

    request.file.path = filePath;
    return next.handle();
  }
}
