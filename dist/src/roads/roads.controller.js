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
exports.RoadsController = void 0;
const common_1 = require("@nestjs/common");
const roads_service_1 = require("./roads.service");
const swagger_1 = require("@nestjs/swagger");
const undefinedToNull_interceptor_1 = require("../common/interceptors/undefinedToNull.interceptor");
const findall_road_response_dto_1 = require("./dto/findall-road-response.dto");
let RoadsController = class RoadsController {
    constructor(roadsService) {
        this.roadsService = roadsService;
    }
    async findAllRoads(placeId) {
        return this.roadsService.findAllRoads(placeId);
    }
    findOne(placeId, roadId) {
        return this.roadsService.findOneRoad(placeId, +roadId);
    }
};
__decorate([
    (0, swagger_1.ApiResponse)({
        type: findall_road_response_dto_1.RoadTrafficDto,
        status: 200,
        description: '도로 정보 전체 조회',
    }),
    (0, swagger_1.ApiOperation)({ summary: '도로 정보 전체 조회' }),
    (0, common_1.Get)(':placeId/roads'),
    __param(0, (0, common_1.Param)('placeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoadsController.prototype, "findAllRoads", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        type: findall_road_response_dto_1.RoadStatusDto,
        status: 200,
        description: '도로 정보 상세 출력',
    }),
    (0, swagger_1.ApiOperation)({ summary: '도로 정보 상세 조회' }),
    (0, common_1.Get)(':placeId/roads/:roadId'),
    __param(0, (0, common_1.Param)('placeId')),
    __param(1, (0, common_1.Param)('roadId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], RoadsController.prototype, "findOne", null);
RoadsController = __decorate([
    (0, swagger_1.ApiTags)('ROADS'),
    (0, common_1.UseInterceptors)(undefinedToNull_interceptor_1.UndefinedToNullInterceptor),
    (0, common_1.Controller)('place'),
    __metadata("design:paramtypes", [roads_service_1.RoadsService])
], RoadsController);
exports.RoadsController = RoadsController;
//# sourceMappingURL=roads.controller.js.map