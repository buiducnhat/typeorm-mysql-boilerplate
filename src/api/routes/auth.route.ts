import { Router, Request, Response, NextFunction } from 'express';
import Container from 'typedi';

import middlewares from '@src/api/middlewares';
import AuthService from '@src/services/auth.service';
import { CreateUserDto } from '@src/dto/user.dto';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  route.post(
    '/signup',
    middlewares.validators.authValidators.signUp,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authServiceInstance = Container.get(AuthService);
        const result = await authServiceInstance.signUp(req.body as CreateUserDto);
        return res.status(201).json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  route.post(
    '/signin',
    middlewares.validators.authValidators.signIn,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password, remember } = req.body;
        const authServiceInstance = Container.get(AuthService);
        const result = await authServiceInstance.signIn(email, password, remember);
        return res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );
};
