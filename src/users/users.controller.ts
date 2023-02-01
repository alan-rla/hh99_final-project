import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Response,
  UseInterceptors,
  ForbiddenException,
  UseGuards,
  HttpException,
  UploadedFile,
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
import { SearchUserDto, SearchUserResponseDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoggedInGuard } from 'src/auth/logged-in.guard';

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
    // 비밀번호 확인 검증
    if (data.password !== data.confirmPW)
      throw new HttpException('비밀번호 확인 불일치', 409);

    const result = await this.usersService.registerUser(
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
  async getUser(@User() user: Users) {
    return user || '로그인 필요';
  }

  @ApiBody({
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: '내 정보 수정 성공',
  })
  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: '내 정보 수정' })
  @UseInterceptors(FileInterceptor('file'))
  @Patch('update')
  async updateUser(
    @User() user: Users,
    @Body() data: UpdateUserDto,
    @UploadedFile() file?: Express.MulterS3.File,
  ) {
    if (!user) return '로그인 필요';
    const result = await this.usersService.updateUser(
      user.id,
      user.nickname,
      data,
      file,
    );

    if (result) {
      return '유저 정보 수정 성공';
    } else {
      throw new ForbiddenException();
    }
  }

  @ApiResponse({
    status: 200,
    description: '회원 탈퇴 완료',
  })
  @ApiCookieAuth('connect.sid')
  @UseGuards(LoggedInGuard)
  @ApiOperation({ summary: '회원 탈퇴' })
  @Delete()
  async deleteUser(@User() user: Users, @Response() res) {
    await this.usersService.deleteUser(user.id);
    res.clearCookie('connect.sid', { httpOnly: true });
    return '회원 탈퇴 완료';
  }

  @ApiBody({
    type: SearchUserDto,
  })
  @ApiResponse({
    type: SearchUserResponseDto,
    status: 200,
    description: '유저 검색 성공',
  })
  @ApiOperation({ summary: '유저 검색' })
  @Post('friend')
  async searchFriend(@Body() data: SearchUserDto) {
    const result = await this.usersService.searchFriend(data.nickname);
    return result;
  }

  @ApiResponse({
    status: 200,
    description: '친구 추가 성공',
  })
  @ApiCookieAuth('connect.sid')
  @UseGuards(LoggedInGuard)
  @ApiOperation({ summary: '검색한 유저 친구 등록' })
  @Post('friend/:friendId')
  async addFriend(@User() user: Users, @Param('friendId') friendId: number) {
    if (!user) return '로그인 필요';
    if (user.id === +friendId)
      throw new HttpException('자기 자신 친구 추가 불가', 403);

    const result = await this.usersService.addFriend(user.id, +friendId);

    if (result) {
      return '친구 추가 성공';
    } else {
      throw new ForbiddenException();
    }
  }
}
