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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopulationService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const xml_js_1 = __importDefault(require("xml-js"));
const xml_value_converter_1 = __importDefault(require("../common/functions/xml.value.converter"));
const exceptions_1 = require("@nestjs/common/exceptions");
let PopulationService = class PopulationService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async findAll(placeId) {
        const url = `http://openapi.seoul.go.kr:8088/${process.env.POP_API_KEY}/xml/citydata/1/5/${placeId}`;
        const rawData = await this.httpService.get(encodeURI(url)).toPromise();
        const data = JSON.parse(xml_js_1.default.xml2json(rawData.data, {
            compact: true,
            spaces: 2,
            textFn: xml_value_converter_1.default,
        }));
        if (!data['SeoulRtd.citydata'])
            throw new exceptions_1.HttpException('wrong place name', 404);
        else
            return data['SeoulRtd.citydata'].CITYDATA.LIVE_PPLTN_STTS;
    }
};
PopulationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], PopulationService);
exports.PopulationService = PopulationService;
//# sourceMappingURL=population.service.js.map