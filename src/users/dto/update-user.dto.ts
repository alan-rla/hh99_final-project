import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({
    example: '항해99',
    description: '닉네임',
  })
  public nickname: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({
    example: 'password',
    description: '비밀번호',
  })
  public password: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({
    example: 'password',
    description: '비밀번호 확인',
  })
  public confirmPW: string;

  @IsOptional()
  @ApiProperty({
    example: 'profileImg.jpg',
    description: '프로필 사진',
  })
  public profileImg: File;
}
