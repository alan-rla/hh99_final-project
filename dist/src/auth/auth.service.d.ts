import { Repository } from 'typeorm';
import { Users } from '../entities/Users';
export declare class AuthService {
    private usersRepository;
    constructor(usersRepository: Repository<Users>);
    validateUser(email: string, password: string): Promise<{
        id: number;
        email: string;
        nickname: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
    }>;
}
