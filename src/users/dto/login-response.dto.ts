import { CreateUserDto } from './create-user.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class LoginResponseDto extends PickType(CreateUserDto, [
  'email',
  'nickname',
]) {
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'ID Number',
  })
  public id: number;
}
