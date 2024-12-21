import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
      .forRoutes
      // { path: '/nguoi-dung/:id', method: RequestMethod.GET },
      ();
  }
}
