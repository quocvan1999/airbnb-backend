import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { BinhLuanModule } from './binh-luan/binh-luan.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BinhLuanModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
