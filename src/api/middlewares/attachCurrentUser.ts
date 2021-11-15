import { Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import * as _ from 'lodash';
import { Repository } from 'typeorm';

import {} from '@src/types/express';
import { User } from '@src/entities/User';
import { UnauthorizedException } from '@src/utils/CustomError';

const attachCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  const userRepository = Container.get('userRepository') as Repository<User>;

  const user = await userRepository
    .createQueryBuilder('user')
    .where('user.id = :id', { id: req.token.id })
    .getOne();

  if (!user) {
    return next(new UnauthorizedException('attachCurrentUSer'));
  }
  req.currentUser = _.omit(user, ['password', 'salt']);
  next();
};

export default attachCurrentUser;
