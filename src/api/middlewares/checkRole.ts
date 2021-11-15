import { Request, Response, NextFunction } from 'express';

import { ForbiddenException } from '@src/utils/CustomError';
import {} from '@src/types/express';

const checkRole = (roles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  const curRole = req.currentUser.role;
  if (!roles.includes(curRole)) {
    return next(new ForbiddenException('checkRole', 'No permissions to do this action'));
  }
  next();
};

export default checkRole;
