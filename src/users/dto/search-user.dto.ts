import { CreateUserDto } from './create-user.dto';
import { PickType } from '@nestjs/swagger';

export class SearchUserDto extends PickType(CreateUserDto, ['nickname']) {}
