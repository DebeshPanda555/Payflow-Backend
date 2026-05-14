"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, message, data = {}, statusCode = 200) => {
    return res.status(statusCode).json({ message, ...data });
};
exports.sendSuccess = sendSuccess;
const sendError = (res, error, details, statusCode = 500) => {
    return res.status(statusCode).json({ error, details });
};
exports.sendError = sendError;
