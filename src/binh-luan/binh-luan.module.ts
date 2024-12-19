import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { BinhLuanService } from './binh-luan.service';
import { BinhLuanController } from './binh-luan.controller';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';

@Module({
  controllers: [BinhLuanController],
  providers: [BinhLuanService],
})
export class BinhLuanModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/binh-luan', method: RequestMethod.POST },
        { path: '/binh-luan', method: RequestMethod.PUT },
      );
  }
}
