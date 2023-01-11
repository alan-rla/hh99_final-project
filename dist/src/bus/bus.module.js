"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusModule = void 0;
const Users_1 = require("./../entities/Users");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const bus_service_1 = require("./bus.service");
const bus_controller_1 = require("./bus.controller");
const axios_1 = require("@nestjs/axios");
let BusModule = class BusModule {
};
BusModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([Users_1.Users]), axios_1.HttpModule],
        controllers: [bus_controller_1.BusController],
        providers: [bus_service_1.BusService],
    })
], BusModule);
exports.BusModule = BusModule;
//# sourceMappingURL=bus.module.js.map