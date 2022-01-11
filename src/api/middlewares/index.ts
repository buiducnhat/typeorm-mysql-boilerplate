import attachCurrentUser from './attachCurrentUser';
import { checkRole, checkPermission } from './checkRole';
import isAuth from './isAuth';
import isOptionalAuth from './isOptionalAuth';
import { uploadImageByDisk, uploadImageByMemory } from './multerUpload';
import * as validators from './validators';

export default {
  attachCurrentUser,
  isAuth,
  isOptionalAuth,
  checkRole,
  checkPermission,
  validators,
  uploadImageByMemory,
  uploadImageByDisk,
};
