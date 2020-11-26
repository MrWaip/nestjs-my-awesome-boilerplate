import { Response } from 'express';
import { LOCALE_COOKIE, TIMEZONE_COOKIE } from './../common/constants';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { NotUniqueEmailException } from './exceptions/not-unique-email.exception';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}

  async findById(id: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findByIdOrFail(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new UserNotFoundException(id);
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async create(payload: CreateUserDto): Promise<User> {
    if (await this.findByEmail(payload.email)) throw new NotUniqueEmailException(payload.email);

    const user = new User();

    user.email = payload.email;
    user.fname = 'fname';
    user.lname = payload.name;
    user.mname = 'mname';
    user.timezone = 'UTC';
    user.locale = 'ru';
    user.password = await UsersService.hashPassword(payload.password);

    return this.userRepository.save(user);
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async changeLocale(user: User, locale: string): Promise<void> {
    await this.userRepository.update(user.id, {
      locale,
    });
  }

  setLocaleCookie(res: Response, locale: string): void {
    res.cookie(LOCALE_COOKIE, locale);
  }

  setTimezoneCookie(res: Response, timezone: string): void {
    res.cookie(TIMEZONE_COOKIE, timezone);
  }
}
