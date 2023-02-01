import { Users } from 'src/entities/Users';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { AreaLike } from 'src/entities/AreaLike';
import { User_Like } from 'src/entities/User_Like';

@Module({
  imports: [TypeOrmModule.forFeature([Users, AreaLike, User_Like])],
  controllers: [AreaController],
  providers: [AreaService],
})
export class AreaModule {}
