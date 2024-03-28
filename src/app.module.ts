/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: "mysql",
    username: "root",
    host: "localhost",
    password: "$Bidcom123",
    port: 3306,
    database: "crud_nest",
    entities: [__dirname + '/**/*.entity.{js, ts}'],
    synchronize: true

  }) ,UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
