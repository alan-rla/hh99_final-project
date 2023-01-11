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
exports.BusController = void 0;
const placeId_request_dto_1 = require("./dto/placeId-request.dto");
const undefinedToNull_interceptor_1 = require("../common/interceptors/undefinedToNull.interceptor");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const bus_service_1 = require("./bus.service");
let BusController = class BusController {
    constructor(busService) {
        this.busService = busService;
    }
    findAll(placeId) {
        return this.busService.findAll(placeId);
    }
    findOne(placeId, busId) {
        return this.busService.findOne(placeId, +busId);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: '장소이름/bus',
        description: '버스 정보 전체 조회',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: '선릉역 주변 전체 버스정류장 Response',
        schema: {
            example: {
                BUS_STN_ID: 122000111,
                BUS_ARS_ID: 23214,
                BUS_STN_NM: '선릉역.선정릉정문',
                BUS_STN_X: 127.0485232,
                BUS_STN_Y: 37.50580675,
                BUS_DETAIL: {
                    BUS_DETAIL: [{}, {}, {}],
                },
            },
        },
    }),
    (0, swagger_1.ApiParam)({
        name: 'placeId',
        required: true,
        description: '장소 이름',
    }),
    (0, common_1.Get)('/:placeId/bus'),
    __param(0, (0, common_1.Param)('placeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [placeId_request_dto_1.PlaceIdRequestDto]),
    __metadata("design:returntype", void 0)
], BusController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: '장소이름/bus/정류소ID',
        description: '버스 정보 단건 조회',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: '선릉역 주변 전체 정류소ID Response',
        schema: {
            example: {
                BUS_STN_ID: 122000111,
                BUS_ARS_ID: 23214,
                BUS_STN_NM: '선릉역.선정릉정문',
                BUS_STN_X: 127.0485232,
                BUS_STN_Y: 37.50580675,
                BUS_DETAIL: {
                    BUS_DETAIL: [{}, {}, {}],
                },
            },
        },
    }),
    (0, swagger_1.ApiParam)({
        name: 'busId',
        required: true,
        description: '정류소ID',
        example: 122000111,
    }),
    (0, common_1.Get)('/:placeId/bus/:busId'),
    __param(0, (0, common_1.Param)('placeId')),
    __param(1, (0, common_1.Param)('busId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [placeId_request_dto_1.PlaceIdRequestDto, Number]),
    __metadata("design:returntype", void 0)
], BusController.prototype, "findOne", null);
BusController = __decorate([
    (0, swagger_1.ApiTags)('BUS'),
    (0, common_1.UseInterceptors)(undefinedToNull_interceptor_1.UndefinedToNullInterceptor),
    (0, common_1.Controller)('place'),
    __metadata("design:paramtypes", [bus_service_1.BusService])
], BusController);
exports.BusController = BusController;
//# sourceMappingURL=bus.controller.js.map