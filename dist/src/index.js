"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const socket_1 = require("./sockets/socket");
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const server = http_1.default.createServer(app_1.default);
(0, socket_1.initSockets)(server);
server.listen(env_1.config.PORT, () => {
    logger_1.logger.info(`Server running natively on port ${env_1.config.PORT}`);
});
