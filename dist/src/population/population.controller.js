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
exports.PopulationController = void 0;
const common_1 = require("@nestjs/common");
const population_service_1 = require("./population.service");
const swagger_1 = require("@nestjs/swagger");
const findall_population_dto_1 = require("./dto/findall-population.dto");
let PopulationController = class PopulationController {
    constructor(populationService) {
        this.populationService = populationService;
    }
    async findAll(placeId) {
        console.log('placeId: ', placeId);
        return await this.populationService.findAll(placeId);
    }
};
__decorate([
    (0, swagger_1.ApiResponse)({
        type: findall_population_dto_1.PopulationDto,
        status: 200,
        description: '인구 정보 조회',
    }),
    (0, swagger_1.ApiOperation)({ summary: '인구 정보 전체 조회' }),
    (0, common_1.Get)('/place/:placeId'),
    __param(0, (0, common_1.Param)('placeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PopulationController.prototype, "findAll", null);
PopulationController = __decorate([
    (0, swagger_1.ApiTags)('POPULATION'),
    (0, common_1.Controller)('population'),
    __metadata("design:paramtypes", [population_service_1.PopulationService])
], PopulationController);
exports.PopulationController = PopulationController;
//# sourceMappingURL=population.controller.js.map