import { Logo } from './../entities/Logo';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class LogoService {
  constructor(
    @InjectRepository(Logo)
    private logoRepository: Repository<Logo>,
  ) {}

  async findLogo() {
    return await this.logoRepository.find();
  }
}
