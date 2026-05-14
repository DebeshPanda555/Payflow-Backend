import 'dotenv/config';
import app from './app';
import http from 'http';
import { initSockets } from './sockets/socket';
import { config } from './config/env';
import { logger } from './config/logger';

const server = http.createServer(app);
initSockets(server);

server.listen(config.PORT, () => {
  logger.info(`Server running natively on port ${config.PORT}`);
});
