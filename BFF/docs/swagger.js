const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BFF API',
      version: '1.0.0',
      description: 'API Gateway for User, Product, and Cart services',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local BFF Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // path to files where routes are annotated
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
