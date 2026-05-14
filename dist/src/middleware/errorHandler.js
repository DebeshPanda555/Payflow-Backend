"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../config/logger");
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error(`${err.name || 'Error'}: ${err.message}\n${err.stack}`);
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        error: message,
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};
exports.errorHandler = errorHandler;
