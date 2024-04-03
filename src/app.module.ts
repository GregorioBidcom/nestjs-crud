/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: "mysql",
    username: "usrbidcom_us",
    host: "200.58.123.140",
    password: "pwdbB1dc0m",
    port: 3306,
    database: "test",
    entities: [__dirname + '/**/*.entity.{js, ts}'],
    synchronize: true

  }) ,UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
