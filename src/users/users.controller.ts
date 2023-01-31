import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ForbiddenException,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';
import {
  ApiBody,
  ApiCookieAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { NotLoggedInGuard } from 'src/auth/not-logged-in.guard';
import { User } from 'src/common/decorators/user.decorator';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { Users } from 'src/entities/Users';
import { LoginResponseDto } from './dto/login-response.dto';
import { SearchUserDto } from './dto/search-user.dto';

@UseInterceptors(UndefinedToNullInterceptor)
@ApiTags('USERS')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    type: CreateUserDto,
    status: 200,
    description: '회원가입 성공',
  })
  @ApiOperation({ summary: '회원가입' })
  @UseGuards(new NotLoggedInGuard())
  @Post()
  async registerUser(@Body() data: CreateUserDto) {
    // 이메일, 닉네임 이미 존재하는지 확인
    const user = await this.usersService.findUser(data.email, data.nickname);
    if (user[1]) throw new HttpException('이메일 또는 닉네임 이미 존재', 409);

    // 비밀번호 확인 검증
    if (data.password !== data.confirmPW)
      throw new HttpException('비밀번호 확인 불일치', 409);

    const result = this.usersService.registerUser(
      data.email,
      data.nickname,
      data.password,
    );

    if (result) {
      return '회원가입 성공';
    } else {
      throw new ForbiddenException();
    }
  }

  @ApiBody({
    type: LoginUserDto,
  })
  @ApiResponse({
    type: LoginResponseDto,
    status: 200,
    description: '로그인 성공',
  })
  @ApiOperation({ summary: '로그인' })
  @UseGuards(new LocalAuthGuard())
  @Post('login')
  async login(@User() user: Users) {
    return user;
  }

  @ApiResponse({
    type: LoginResponseDto,
    status: 200,
    description: '내 정보 조회 성공',
  })
  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: '내 정보 조회' })
  @Get()
  getUser(@User() user: Users) {
    return user || '로그인 필요';
  }

  @ApiOperation({ summary: '유저 검색' })
  @Post('friend')
  async searchFriend(@Body() data: SearchUserDto) {
    const result = await this.usersService.searchFriend(data.nickname);
    return result;
  }

  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: '검색한 유저 친구 등록' })
  @Post('friend/:friendId')
  async addFriend(@User() user: Users, @Param('friendId') friendId: number) {
    if (!user) return '로그인 필요';
    if (user.id === +friendId)
      throw new HttpException('자기 자신 친구 추가 불가', 403);

    const result = await this.usersService.addFriend(user.id, +friendId);

    if (result) {
      return '친구 추가 성공';
    }
  }
}
