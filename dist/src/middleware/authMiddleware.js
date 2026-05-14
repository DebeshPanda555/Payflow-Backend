"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const apiResponse_1 = require("../utils/apiResponse");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return (0, apiResponse_1.sendError)(res, 'Unauthorized: No token provided', undefined, 401);
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.config.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return (0, apiResponse_1.sendError)(res, 'Unauthorized: Invalid token', error.message, 401);
    }
};
exports.authenticate = authenticate;
