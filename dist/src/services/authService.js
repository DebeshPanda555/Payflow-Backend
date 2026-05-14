"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const env_1 = require("../config/env");
const register = async (email, password, name) => {
    const existingUser = await prismaClient_1.default.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('User already exists');
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = await prismaClient_1.default.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            wallets: { create: { balance: 1000 } }
        },
    });
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, env_1.config.JWT_SECRET, { expiresIn: '1d' });
    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
};
exports.register = register;
const login = async (email, password) => {
    const user = await prismaClient_1.default.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Invalid email or password');
    }
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, env_1.config.JWT_SECRET, { expiresIn: '1d' });
    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
};
exports.login = login;
