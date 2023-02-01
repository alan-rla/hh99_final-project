import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { LoginResponseDto } from './login-response.dto';

export class SearchUserDto extends PickType(LoginResponseDto, ['nickname']) {}

export class SearchUserResponseDto extends PickType(LoginResponseDto, [
  'id',
  'nickname',
]) {
  @IsString()
  @ApiProperty({
    example:
      'https://spartamap.s3.ap-northeast-2.amazonaws.com/ba927ff34cd961ce2c184d47e8ead9f6_1675224216679.jpg',
    description: 'Profile Image URL',
  })
  public profileImg: string;
}
