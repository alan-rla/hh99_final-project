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
exports.BusService = void 0;
const xml_value_converter_1 = __importDefault(require("../common/functions/xml.value.converter"));
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const xml_js_1 = __importDefault(require("xml-js"));
let BusService = class BusService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async findAll(placeId) {
        const apiUrl = `http://openapi.seoul.go.kr:8088/${process.env.BUS_API_SECRET_KEY}/xml/citydata/1/2/${placeId}`;
        const result = await this.httpService.get(encodeURI(apiUrl)).toPromise();
        const data = xml_js_1.default.xml2json(result.data, {
            compact: true,
            spaces: 4,
            textFn: xml_value_converter_1.default,
        });
        const dataToJson = JSON.parse(data);
        if (!dataToJson['SeoulRtd.citydata'])
            throw new common_1.HttpException('wrong place name', 404);
        const busData = dataToJson['SeoulRtd.citydata'].CITYDATA.BUS_STN_STTS.BUS_STN_STTS;
        return busData;
    }
    async findOne(placeId, busId) {
        const apiUrl = `http://openapi.seoul.go.kr:8088/${process.env.BUS_API_SECRET_KEY}/xml/citydata/1/2/${placeId}`;
        const result = await this.httpService.get(encodeURI(apiUrl)).toPromise();
        const data = xml_js_1.default.xml2json(result.data, {
            compact: true,
            spaces: 4,
            textFn: xml_value_converter_1.default,
        });
        const dataToJson = JSON.parse(data);
        if (!dataToJson['SeoulRtd.citydata'])
            throw new common_1.HttpException('wrong place name', 404);
        const busData = dataToJson['SeoulRtd.citydata'].CITYDATA.BUS_STN_STTS.BUS_STN_STTS;
        const resultData = busData.find((obj) => obj.BUS_STN_ID === busId);
        if (!resultData)
            throw new common_1.HttpException('wrong busId', 404);
        return resultData;
    }
};
BusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], BusService);
exports.BusService = BusService;
//# sourceMappingURL=bus.service.js.map