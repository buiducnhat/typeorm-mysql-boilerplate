import { Service, Inject } from 'typedi';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import * as _ from 'lodash';

import config from '@src/config';
import { User } from '@src/entities/User';
import { CreateUserDto, UserViewDto } from '@src/dto/user.dto';
import { randomBytes } from 'crypto';
import { BadRequestError, GenericError, UnauthorizedError } from '@src/utils/CustomError';
import { convertDto, generateAvatar } from '@src/utils/common';

@Service()
export default class AuthService {
  serviceName: string;

  constructor(@Inject('userRepository') private userRepository: Repository<User>) {}

  public async signUp(userInputDto: CreateUserDto): Promise<{ user: UserViewDto; token: string }> {
    // Check if email is already existed
    if (await this.checkExistUser(userInputDto.email)) {
      throw new BadRequestError('signUp', 'This email already exists');
    }

    const salt = randomBytes(32);
    const hashedPassword = await argon2.hash(userInputDto.password, { salt });

    const newUser: User = new User();
    convertDto(userInputDto, newUser);
    newUser.salt = salt.toString('hex');
    newUser.password = hashedPassword;
    if (!newUser.avatar) {
      newUser.avatar = await generateAvatar(userInputDto.firstName, userInputDto.lastName);
    }

    const user = await this.userRepository.save(newUser);

    if (!user) {
      throw new GenericError('signUp');
    }
    const token = this.generateToken(user);

    return { token, user: _.omit(user, ['password', 'salt']) };
  }

  public async signIn(
    email: string,
    password: string,
    remember: boolean,
  ): Promise<{ user: UserViewDto; token: string }> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email })
      .getOne();

    if (!user) {
      throw new UnauthorizedError('signIn', 'User with email not found');
    }

    // We use verify from argon2 to prevent 'timing based' attacks
    const validPassword = await argon2.verify(user.password, password);
    if (validPassword) {
      const token = this.generateToken(user, remember);
      return { token, user: _.omit(user, ['password', 'salt']) };
    } else {
      throw new UnauthorizedError('signIn', 'Wrong password');
    }
  }

  private async checkExistUser(email: string): Promise<boolean> {
    const userCount = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email })
      .getCount();

    return userCount > 0;
  }

  private generateToken(user: User, isLongExpire: boolean = false) {
    const jwtAlgorithm = config.jwtAlgorithm;
    return jwt.sign(
      {
        id: user.id,
      },
      config.jwtSecret,
      {
        algorithm: jwtAlgorithm,
        expiresIn: isLongExpire ? config.jwtExpireTimeLong : config.jwtExpireTimeNormal,
      },
    );
  }
}
