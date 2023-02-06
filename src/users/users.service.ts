import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository, DataSource, Like } from 'typeorm';
import bcrypt from 'bcrypt';
import { Friends } from 'src/entities/Friends';
import { UpdateUserDto } from './dto/update-user.dto';
import { TermsCondition } from 'src/entities/termscondition';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(Friends) private friendsRepository: Repository<Friends>,
    @InjectRepository(TermsCondition)
    private termsconditionRepository: Repository<TermsCondition>,
    private dataSource: DataSource,
  ) {}

  //회원가입
  async registerUser(email: string, nickname: string, password: string) {
    //회원가입이 진행시 약관동의 테이블에도 회원가입유저의 약관 동의 여부를 저장행야하기 때문에 트랜잭션을 사용한다
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 이메일, 닉네임 이미 존재하는지 확인
      const search = await this.usersRepository.findAndCount({
        where: [{ email }, { nickname }],
      });
      if (search[1])
        throw new HttpException('이메일 또는 닉네임 이미 존재', 409);

      const hashedPW = await bcrypt.hash(password, +process.env.PASSWORD_SALT);
      const result = await queryRunner.manager.getRepository(Users).save({
        email,
        nickname,
        password: hashedPW,
        profileImg: process.env.DEFAULT_IMG,
      });

      //회원가입 전 약관동의가 필수, 회원가입시 약관동의 테이블에 회원가입한 유저의 약관동의 정보를 입력해준다
      const terms = new TermsCondition();
      terms.agreed = 'agreed';
      terms.user = result;
      terms.createdAt = new Date();
      terms.updatedAt = new Date();

      const tcsave = await queryRunner.manager
        .getRepository(TermsCondition)
        .save(terms);

      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  //회원정보 수정
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

  //회원 탈퇴
  async deleteUser(id: number) {
    await this.usersRepository.delete(id);
  }

  //친구 찾기
  async searchFriend(nickname: string) {
    const result = await this.usersRepository.find({
      where: { nickname: Like(`%${nickname}%`) },
      select: { id: true, nickname: true, profileImg: true },
    });
    return result;
  }

  //친구 추가
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
