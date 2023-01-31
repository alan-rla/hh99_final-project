import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository, DataSource, Like } from 'typeorm';
import bcrypt from 'bcrypt';
import { Friends } from 'src/entities/Friends';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(Friends) private friendsRepository: Repository<Friends>,
    private dataSource: DataSource,
  ) {}

  async findUser(email?: string, nickname?: string) {
    const result = await this.usersRepository.findAndCount({
      where: [{ email }, { nickname }],
    });
    return result;
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

  async searchFriend(nickname: string) {
    const result = await this.usersRepository.find({
      where: { nickname: Like(`%${nickname}%`) },
    });
    return result;
  }

  async addFriend(id: number, friendId: number) {
    try {
      const user = await this.usersRepository.findAndCount({
        where: [{ id: friendId }],
      });
      if (!user[1]) throw new HttpException('추가할 친구 없음', 404);

      const friend = await this.friendsRepository.findAndCount({
        where: { UserId: id, FriendId: friendId },
      });
      if (friend[1]) throw new HttpException('이미 친구 추가 됨', 404);

      const result = await this.friendsRepository.save({
        UserId: id,
        FriendId: friendId,
      });
      return result;
    } catch (err) {
      throw err;
    }
  }
}
