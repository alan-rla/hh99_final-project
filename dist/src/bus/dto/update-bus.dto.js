"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBusDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_bus_dto_1 = require("./create-bus.dto");
class UpdateBusDto extends (0, swagger_1.PartialType)(create_bus_dto_1.CreateBusDto) {
}
exports.UpdateBusDto = UpdateBusDto;
//# sourceMappingURL=update-bus.dto.js.map