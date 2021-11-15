import attachCurrentUser from './attachCurrentUser';
import checkRole from './checkRole';
import isAuth from './isAuth';
import validators from './validators';
import { uploadImage } from './multerUpload';

export default {
  attachCurrentUser,
  isAuth,
  validators,
  checkRole,
  uploadImage,
};
