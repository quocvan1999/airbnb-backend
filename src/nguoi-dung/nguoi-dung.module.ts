import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { NguoiDungService } from './nguoi-dung.service';
import { NguoiDungController } from './nguoi-dung.controller';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';

@Module({
  controllers: [NguoiDungController],
  providers: [NguoiDungService],
})
export class NguoiDungModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/nguoi-dung/:id', method: RequestMethod.GET },
        { path: '/nguoi-dung', method: RequestMethod.GET },
        { path: '/nguoi-dung', method: RequestMethod.POST },
        { path: '/nguoi-dung/:id', method: RequestMethod.DELETE },
        { path: '/nguoi-dung/:id', method: RequestMethod.PUT },
        { path: '/nguoi-dung/upload-avatar', method: RequestMethod.POST },
      );
  }
}
