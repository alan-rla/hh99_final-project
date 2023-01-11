import { Users } from 'src/entities/Users';
import { Repository, DataSource } from 'typeorm';
export declare class UsersService {
    private usersRepository;
    private dataSource;
    constructor(usersRepository: Repository<Users>, dataSource: DataSource);
    findByEmail(email: string): Promise<Users>;
    findByNickname(nickname: string): Promise<Users>;
    registerUser(email: string, nickname: string, password: string): Promise<void>;
}
