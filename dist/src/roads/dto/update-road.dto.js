"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRoadDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_road_dto_1 = require("./create-road.dto");
class UpdateRoadDto extends (0, swagger_1.PartialType)(create_road_dto_1.CreateRoadDto) {
}
exports.UpdateRoadDto = UpdateRoadDto;
//# sourceMappingURL=update-road.dto.js.map