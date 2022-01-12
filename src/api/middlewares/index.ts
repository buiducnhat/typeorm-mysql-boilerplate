import attachCurrentUser from './attach-user.middleware';
import { checkRole, checkPermission } from './check-role.middleware';
import isAuth from './is-auth.middleware';
import isOptionalAuth from './is-optional-auth.middleware';
import { uploadImageByDisk, uploadImageByMemory } from './multer-upload.middleware';
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
