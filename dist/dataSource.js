"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const Users_1 = require("./src/entities/Users");
dotenv_1.default.config();
const dataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    logging: true,
    charset: 'utf8_general_ci',
    synchronize: false,
    migrations: [__dirname + '/src/migrations/*.ts'],
    entities: [Users_1.Users],
});
exports.default = dataSource;
//# sourceMappingURL=dataSource.js.map