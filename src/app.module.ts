import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { BinhLuanModule } from './binh-luan/binh-luan.module';
import { DatPhongModule } from './dat-phong/dat-phong.module';
import { NguoiDungModule } from './nguoi-dung/nguoi-dung.module';
import { PhongModule } from './phong/phong.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BinhLuanModule,
    DatPhongModule,
    NguoiDungModule,
    PhongModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
