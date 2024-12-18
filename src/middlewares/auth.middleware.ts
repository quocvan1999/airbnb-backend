import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers['token'] as string;

      if (!token) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Vui lòng đăng nhập để truy cập tài nguyên này',
        });
      }

      const decoded = jwt.verify(`${token}`, process.env.JWT_SECRET);

      req['user'] = decoded;

      next();
    } catch (err) {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        message: 'Bạn không có quyền truy cập tài nguyên này',
      });
    }
  }
}
