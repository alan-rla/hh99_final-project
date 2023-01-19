import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository, DataSource } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private dataSource: DataSource,
  ) {}

  async findByEmail(email: string) {
    return this.usersRepository.findAndCount({
      where: { email },
      select: ['id', 'email'],
    });
  }

  async findByNickname(nickname: string) {
    return this.usersRepository.findAndCount({
      where: { nickname },
      select: ['id', 'nickname'],
    });
  }

  async registerUser(email: string, nickname: string, password: string) {
    try {
      const hashedPW = await bcrypt.hash(password, +process.env.PASSWORD_SALT);
      await this.usersRepository.save({
        email,
        nickname,
        password: hashedPW,
      });
    } catch (err) {
      throw err;
    }
  }
}
