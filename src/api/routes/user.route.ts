import { Router, Request, Response } from 'express';

import middlewares from '@src/api/middlewares';

const route = Router();

export default (app: Router) => {
  app.use('/users', route);

  route.get(
    '/me',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    (req: Request, res: Response) => {
      return res.status(200).json({ user: req.currentUser });
    },
  );
};
