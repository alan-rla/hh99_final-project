"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePopulationDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_population_dto_1 = require("./create-population.dto");
class UpdatePopulationDto extends (0, mapped_types_1.PartialType)(create_population_dto_1.CreatePopulationDto) {
}
exports.UpdatePopulationDto = UpdatePopulationDto;
//# sourceMappingURL=update-population.dto.js.map