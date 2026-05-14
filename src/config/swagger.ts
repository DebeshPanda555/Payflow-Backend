import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PayFlow Fintech Server',
      version: '1.0.0',
      description: 'Production Scalable backend supporting PayFlow payments interface',
    },
    servers: [{ url: `http://localhost:${config.PORT}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        TransferRequest: {
          type: 'object',
          properties: {
            amount: { type: 'number' },
            recipientEmail: { type: 'string' }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
