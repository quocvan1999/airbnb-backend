import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PhongService } from './phong.service';
import { PhongController } from './phong.controller';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';

@Module({
  controllers: [PhongController],
  providers: [PhongService],
})
export class PhongModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/phong', method: RequestMethod.POST },
        { path: '/phong/:id', method: RequestMethod.PUT },
        { path: '/phong/:id', method: RequestMethod.DELETE },
        { path: '/phong/upload-hinh-phong', method: RequestMethod.POST },
      );
  }
}
