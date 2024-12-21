import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ViTriService } from './vi-tri.service';
import { ViTriController } from './vi-tri.controller';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';

@Module({
  controllers: [ViTriController],
  providers: [ViTriService],
})
export class ViTriModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/vi-tri', method: RequestMethod.POST },
        { path: '/vi-tri/:id', method: RequestMethod.PUT },
      );
  }
}
