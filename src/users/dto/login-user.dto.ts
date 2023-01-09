import { CreateUserDto } from './create-user.dto';
import { IsNumber } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class LoginUserDto extends PickType(CreateUserDto, [
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
