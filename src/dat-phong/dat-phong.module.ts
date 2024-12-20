import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { DatPhongService } from './dat-phong.service';
import { DatPhongController } from './dat-phong.controller';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';

@Module({
  controllers: [DatPhongController],
  providers: [DatPhongService],
})

export class DatPhongModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/dat-phong', method: RequestMethod.GET },
        { path: '/dat-phong', method: RequestMethod.POST },
        { path: '/dat-phong/:id', method: RequestMethod.GET },
        { path: '/dat-phong/:id', method: RequestMethod.PUT },
        { path: '/dat-phong/:id', method: RequestMethod.DELETE },
        {
          path: '/dat-phong/lay-theo-nguoi-dung/:MaNguoiDung',
          method: RequestMethod.GET,
        },
      );
  }
}
