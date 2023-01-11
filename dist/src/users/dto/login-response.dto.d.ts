import { CreateUserDto } from './create-user.dto';
declare const LoginResponseDto_base: import("@nestjs/common").Type<Pick<CreateUserDto, "email" | "nickname">>;
export declare class LoginResponseDto extends LoginResponseDto_base {
    id: number;
}
export {};
