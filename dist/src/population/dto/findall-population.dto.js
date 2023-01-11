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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopulationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class PopulationDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '여유',
        description: '장소 혼잡도 지표',
    }),
    __metadata("design:type", String)
], PopulationDto.prototype, "AREA_CONGEST_LVL", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '사람이 몰려있을 가능성이 낮고 붐빔은 거의 느껴지지 않아요. 도보 이동이 자유로워요.',
        description: '장소 혼잡도 지표 관련 메세지',
    }),
    __metadata("design:type", String)
], PopulationDto.prototype, "AREA_CONGEST_MSG", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '16000',
        description: '실시간 인구 지표 최소값',
    }),
    __metadata("design:type", Number)
], PopulationDto.prototype, "AREA_PPLTN_MIN", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '18000',
        description: '실시간 인구 지표 최대값',
    }),
    __metadata("design:type", Number)
], PopulationDto.prototype, "AREA_PPLTN_MAX", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '51.7',
        description: '남성 인구 비율(남성)',
    }),
    __metadata("design:type", Number)
], PopulationDto.prototype, "MALE_PPLTN_RATE", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '48.3',
        description: '남성 인구 비율(여성)',
    }),
    __metadata("design:type", Number)
], PopulationDto.prototype, "FEMALE_PPLTN_RATE", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '0.1',
        description: '0~10세 인구 비율',
    }),
    __metadata("design:type", Number)
], PopulationDto.prototype, "PPLTN_RATE_0", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2.7',
        description: '10대 실시간 인구 비율',
    }),
    __metadata("design:type", Number)
], PopulationDto.prototype, "PPLTN_RATE_10", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '19.5',
        description: '20대 실시간 인구 비율',
    }),
    __metadata("design:type", Number)
], PopulationDto.prototype, "PPLTN_RATE_20", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '25.3',
        description: '30대 실시간 인구 비율',
    }),
    __metadata("design:type", Number)
], PopulationDto.prototype, "PPLTN_RATE_30", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '23.9',
        description: '40대 실시간 인구 비율',
    }),
    __metadata("design:type", Number)
], PopulationDto.prototype, "PPLTN_RATE_40", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '17.6',
        description: '50대 실시간 인구 비율',
    }),
    __metadata("design:type", Number)
], PopulationDto.prototype, "PPLTN_RATE_50", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '7.8',
        description: '60대 실시간 인구 비율',
    }),
    __metadata("design:type", Number)
], PopulationDto.prototype, "PPLTN_RATE_60", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '3.0',
        description: '70대 실시간 인구 비율',
    }),
    __metadata("design:type", Number)
], PopulationDto.prototype, "PPLTN_RATE_70", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '5.9',
        description: '상주 인구 비율',
    }),
    __metadata("design:type", Number)
], PopulationDto.prototype, "RESNT_PPLTN_RATE", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '94.1',
        description: '비상주 인구 비율',
    }),
    __metadata("design:type", Number)
], PopulationDto.prototype, "NON_RESNT_PPLTN_RATE", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'N',
        description: '대체 데이터 여부',
    }),
    __metadata("design:type", String)
], PopulationDto.prototype, "REPLACE_YN", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2023-01-10 20:30',
        description: '실시간 인구 데이터 업데이트 시간',
    }),
    __metadata("design:type", String)
], PopulationDto.prototype, "PPLTN_TIME", void 0);
exports.PopulationDto = PopulationDto;
//# sourceMappingURL=findall-population.dto.js.map