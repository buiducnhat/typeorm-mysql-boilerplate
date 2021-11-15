import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';

import middlewares from '@src/api/middlewares';
import ImageService from '@src/services/image.service';
import { BadRequestException } from '@src/utils/CustomError';
import { UserRole } from '@src/entities/User';

const route = Router();

export default (app: Router) => {
  app.use('/uploads', route);

  route.post(
    '/images',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.uploadImage.single('image'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const imageServiceInstance = Container.get(ImageService);

        const image = req.file;
        if (!image) {
          next(new BadRequestException('uploadImage', 'Invalid image'));
        }
        const result = await imageServiceInstance.upload(image.path);
        return res.status(201).json(result);
      } catch (err) {
        next(err);
      }
    },
  );
};
