import { Logo } from './../entities/Logo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LogoController } from './logo.controller';
import { LogoService } from './logo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Logo])],
  controllers: [LogoController],
  providers: [LogoService],
})
export class LogoModule {}
