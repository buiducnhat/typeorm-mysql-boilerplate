import { Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import * as _ from 'lodash';
import { Repository } from 'typeorm';

import {} from '@src/types/express';
import { User } from '@src/entities/User';
import { UnauthorizedError } from '@src/utils/CustomError';

const attachCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  const userRepository = Container.get('userRepository') as Repository<User>;

  const user = await userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.role', 'role')
    .where('user.id = :id', { id: req.token.id })
    .getOne();

  if (!user) {
    return next(new UnauthorizedError('attachCurrentUSer'));
  }
  req.currentUser = _.omit(user, ['password', 'salt']);
  next();
};

export default attachCurrentUser;
