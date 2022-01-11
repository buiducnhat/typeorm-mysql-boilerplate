import { Router } from 'express';

import authApi from './routes/auth';
import userApi from './routes/user';

import setupSwagger from './setup-swagger';

export default () => {
  const app = Router();

  setupSwagger(app);

  authApi(app);
  userApi(app);

  return app;
};
