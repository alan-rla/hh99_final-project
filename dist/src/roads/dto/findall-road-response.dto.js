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
exports.RoadStatusDto = exports.RoadDataDto = exports.RoadTrafficDto = exports.CityDataDto = exports.SeoulRtdDto = exports.FindAllRoadDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class FindAllRoadDto {
}
exports.FindAllRoadDto = FindAllRoadDto;
class SeoulRtdDto {
}
exports.SeoulRtdDto = SeoulRtdDto;
class CityDataDto {
}
exports.CityDataDto = CityDataDto;
class RoadTrafficDto {
}
exports.RoadTrafficDto = RoadTrafficDto;
class RoadDataDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '해당 장소로 이동·진입시 시간이 오래 걸릴 수 있어요.',
        description: '전체도로소통평균현황 메세지',
    }),
    __metadata("design:type", String)
], RoadDataDto.prototype, "ROAD_MSG", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '정체',
        description: '전체도로소통평균현황',
    }),
    __metadata("design:type", String)
], RoadDataDto.prototype, "ROAD_TRAFFIC_IDX", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2023-01-10 20:05',
        description: '도로소통현황 업데이트 시간',
    }),
    __metadata("design:type", String)
], RoadDataDto.prototype, "ROAD_TRFFIC_TIME", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 12,
        description: '전체도로소통평균속도',
    }),
    __metadata("design:type", Number)
], RoadDataDto.prototype, "ROAD_TRAFFIC_SPD", void 0);
exports.RoadDataDto = RoadDataDto;
class RoadStatusDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1220003302,
        description: '도로구간 LINK ID',
    }),
    __metadata("design:type", Number)
], RoadStatusDto.prototype, "LINK_ID", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '영동대로',
        description: '도로명',
    }),
    __metadata("design:type", String)
], RoadStatusDto.prototype, "ROAD_NM", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1220040300,
        description: '도로노드시작지점 코드',
    }),
    __metadata("design:type", Number)
], RoadStatusDto.prototype, "START_ND_CD", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '삼성역사거리',
        description: '도로노드시작명',
    }),
    __metadata("design:type", String)
], RoadStatusDto.prototype, "START_ND_NM", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '127.0631551248171434_37.5088875159677215',
        description: '도로노드시작지점좌표',
    }),
    __metadata("design:type", String)
], RoadStatusDto.prototype, "START_ND_XY", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1220042500,
        description: '도로노드종료지점 코드',
    }),
    __metadata("design:type", Number)
], RoadStatusDto.prototype, "END_ND_CD", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '아이파크타워',
        description: '도로노드종료명',
    }),
    __metadata("design:type", String)
], RoadStatusDto.prototype, "END_ND_NM", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '127.0608803393490263_37.5131222727573643',
        description: '도로노드종료지점좌표',
    }),
    __metadata("design:type", String)
], RoadStatusDto.prototype, "END_ND_XY", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 511,
        description: '도로구간길이',
    }),
    __metadata("design:type", Number)
], RoadStatusDto.prototype, "DIST", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 15,
        description: '도로구간평균속도',
    }),
    __metadata("design:type", Number)
], RoadStatusDto.prototype, "SPD", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '정체',
        description: '도로구간소통지표',
    }),
    __metadata("design:type", String)
], RoadStatusDto.prototype, "IDX", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '127.0608179467803467_37.5131010042639232|127.0630927340002927_37.5088662486585420',
        description: '링크아이디 좌표(보간점)',
    }),
    __metadata("design:type", String)
], RoadStatusDto.prototype, "XYLIST", void 0);
exports.RoadStatusDto = RoadStatusDto;
//# sourceMappingURL=findall-road-response.dto.js.map