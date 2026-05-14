"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSockets = void 0;
const socket_io_1 = require("socket.io");
const logger_1 = require("../config/logger");
let io;
const initSockets = (server) => {
    io = new socket_io_1.Server(server, {
        cors: { origin: '*' }
    });
    io.on('connection', (socket) => {
        logger_1.logger.debug(`A user connected: ${socket.id}`);
        socket.on('disconnect', () => {
            logger_1.logger.debug(`User disconnected: ${socket.id}`);
        });
    });
    return io;
};
exports.initSockets = initSockets;
const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not explicitly initialized');
    }
    return io;
};
exports.getIO = getIO;
