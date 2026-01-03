import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Farmer Advisory Platform API',
      version: '1.0.0',
      description: 'API documentation for Farmer Advisory Platform - Phase 1',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token',
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      {
        name: 'Areas',
        description: 'Area management endpoints (States, Districts, Villages)',
      },
      {
        name: 'Crops',
        description: 'Crop management endpoints',
      },
      {
        name: 'Weather',
        description: 'Weather information endpoints',
      },
      {
        name: 'Recommendations',
        description: 'Crop recommendation endpoints',
      },
      {
        name: 'Market Prices',
        description: 'Market price endpoints',
      },
      {
        name: 'Admin',
        description: 'Admin panel endpoints',
      },
    ],
  },
  apis: ['./src/**/*.ts'], // Path to the API files
};

export const swaggerSpec = swaggerJsdoc(options);

