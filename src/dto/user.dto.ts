import { User } from '@src/entities/User';

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  password: string;
}

export type UserViewDto = Omit<User, 'password' | 'salt'>;
