/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Link])],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
