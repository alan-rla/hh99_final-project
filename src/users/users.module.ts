import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Friends } from 'src/entities/Friends';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Friends])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
