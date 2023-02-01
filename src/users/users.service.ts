import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository, DataSource, Like } from 'typeorm';
import bcrypt from 'bcrypt';
import { Friends } from 'src/entities/Friends';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(Friends) private friendsRepository: Repository<Friends>,
    private dataSource: DataSource,
  ) {}

  async registerUser(email: string, nickname: string, password: string) {
    try {
      // 이메일, 닉네임 이미 존재하는지 확인
      const search = await this.usersRepository.findAndCount({
        where: [{ email }, { nickname }],
      });
      if (search[1])
        throw new HttpException('이메일 또는 닉네임 이미 존재', 409);

      const hashedPW = await bcrypt.hash(password, +process.env.PASSWORD_SALT);
      const result = await this.usersRepository.save({
        email,
        nickname,
        password: hashedPW,
        profileImg: process.env.DEFAULT_IMG,
      });
      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateUser(
    id: number,
    nickname: string,
    data: UpdateUserDto,
    file?: Express.MulterS3.File,
  ) {
    //닉네임 변경
    if (data.nickname) {
      if (nickname === data.nickname) {
        throw new HttpException('닉네임 기존과 동일', 409);
      } else {
        const result = await this.usersRepository.update(
          { id },
          { nickname: data.nickname },
        );
        return result;
      }
    }
    //비밀번호 변경
    if (data.password) {
      if (data.password !== data.confirmPW) {
        throw new HttpException('비밀번호 확인 불일치', 409);
      } else {
        const hashedPW = await bcrypt.hash(
          data.password,
          +process.env.PASSWORD_SALT,
        );
        const result = await this.usersRepository.update(
          { id },
          { password: hashedPW },
        );
        return result;
      }
    }
    //프로필 사진 변경
    if (file) {
      const result = await this.usersRepository.update(
        { id },
        { profileImg: file.location },
      );
      return result;
    }
  }

  async deleteUser(id: number) {
    await this.usersRepository.delete(id);
  }

  async searchFriend(nickname: string) {
    const result = await this.usersRepository.find({
      where: { nickname: Like(`%${nickname}%`) },
      select: { id: true, nickname: true, profileImg: true },
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
