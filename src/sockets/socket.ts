import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { logger } from '../config/logger';

let io: Server;

export const initSockets = (server: HttpServer) => {
  io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket: Socket) => {
    logger.debug(`A user connected: ${socket.id}`);
    
    socket.on('disconnect', () => {
      logger.debug(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not explicitly initialized');
  }
  return io;
};
