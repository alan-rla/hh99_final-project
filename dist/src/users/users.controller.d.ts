import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from 'src/entities/Users';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    registerUser(data: CreateUserDto): Promise<string>;
    login(user: Users): Promise<Users>;
    getUser(user: Users): false | Users;
}
