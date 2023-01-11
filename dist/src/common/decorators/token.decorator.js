"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const common_1 = require("@nestjs/common");
exports.Token = (0, common_1.createParamDecorator)((data, ctx) => {
    const response = ctx.switchToHttp().getResponse();
    return response.locals.jwt;
});
//# sourceMappingURL=token.decorator.js.map