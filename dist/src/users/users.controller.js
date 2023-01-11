"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const undefinedToNull_interceptor_1 = require("../common/interceptors/undefinedToNull.interceptor");
const swagger_1 = require("@nestjs/swagger");
const create_user_dto_1 = require("./dto/create-user.dto");
const not_logged_in_guard_1 = require("../auth/not-logged-in.guard");
const user_decorator_1 = require("../common/decorators/user.decorator");
const local_auth_guard_1 = require("../auth/local-auth.guard");
const login_user_dto_1 = require("./dto/login-user.dto");
const Users_1 = require("../entities/Users");
const login_response_dto_1 = require("./dto/login-response.dto");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async registerUser(data) {
        const email = await this.usersService.findByEmail(data.email);
        const nickname = await this.usersService.findByNickname(data.nickname);
        if (email || nickname)
            throw new common_1.HttpException('이메일 또는 닉네임 이미 존재', 409);
        if (data.password !== data.confirmPW)
            throw new common_1.HttpException('비밀번호 확인 불일치', 409);
        const result = this.usersService.registerUser(data.email, data.nickname, data.password);
        if (result) {
            return '회원가입 성공';
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
    async login(user) {
        return user;
    }
    getUser(user) {
        return user || false;
    }
};
__decorate([
    (0, swagger_1.ApiResponse)({
        type: create_user_dto_1.CreateUserDto,
        status: 200,
        description: '회원가입 성공',
    }),
    (0, swagger_1.ApiOperation)({ summary: '회원가입' }),
    (0, common_1.UseGuards)(new not_logged_in_guard_1.NotLoggedInGuard()),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "registerUser", null);
__decorate([
    (0, swagger_1.ApiBody)({
        type: login_user_dto_1.LoginUserDto,
    }),
    (0, swagger_1.ApiResponse)({
        type: login_response_dto_1.LoginResponseDto,
        status: 200,
        description: '로그인 성공',
    }),
    (0, swagger_1.ApiOperation)({ summary: '로그인' }),
    (0, common_1.UseGuards)(new local_auth_guard_1.LocalAuthGuard()),
    (0, common_1.Post)('login'),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Users_1.Users]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        type: login_response_dto_1.LoginResponseDto,
        status: 200,
        description: '내 정보 조회 성공',
    }),
    (0, swagger_1.ApiCookieAuth)('connect.sid'),
    (0, swagger_1.ApiOperation)({ summary: '내 정보 조회' }),
    (0, common_1.Get)(),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Users_1.Users]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getUser", null);
UsersController = __decorate([
    (0, common_1.UseInterceptors)(undefinedToNull_interceptor_1.UndefinedToNullInterceptor),
    (0, swagger_1.ApiTags)('USERS'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map