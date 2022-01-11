import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import appRootPath from 'app-root-path';

import config from '@src/config';

const options: swaggerJSDoc.OAS3Options = {
  swaggerDefinition: {
    info: {
      title: 'Gerpan express boilerplate',
      description: 'REST API for Gerpan express boilerplate',
      version: '1.0',
      contact: {
        email: 'nhaths4701@gmail.com',
        name: 'Gerpan',
        url: 'https://facebook.com/gerpan.4701',
      },
      termsOfService: 'http://swagger.io/terms/',
      license: {
        name: 'Apache 2.0',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
      },
    },
    openapi: '3.0.1',
    servers: [
      { url: config.host, description: 'Main server' },
      { url: `http://localhost:${config.port}/${config.api.prefix}`, description: 'Local server' },
    ],
  },
  apis: [`${appRootPath}/src/api/docs/**/*.yaml`],
};

const swaggerSpec = swaggerJSDoc(options);

export default (app: Router) => {
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, { customCss: '.swagger-ui .topbar { display: none }' }),
  );
};
