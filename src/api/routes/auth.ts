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

  /**
   * @TODO Let's leave this as a place holder for now
   * The reason for a logout route could be deleting a 'push notification token'
   * so the device stops receiving push notifications after logout.
   *
   * Another use case for advance/enterprise apps, you can store a record of the jwt token
   * emitted for the session and add it to a black list.
   * It's really annoying to develop that but if you had to, please use Redis as your data store
   */
  route.post('/logout', middlewares.isAuth, (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).end();
    } catch (err) {
      next(err);
    }
  });
};
