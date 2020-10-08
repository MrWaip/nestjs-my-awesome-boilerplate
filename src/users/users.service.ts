import { Response } from 'express';
import { LOCALE_COOKIE } from './../common/constants';
import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { USER_REPOSITORY } from './constants';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { NotUniqueEmailException } from './exceptions/not-unique-email.exception';
import * as bcrypt from 'bcrypt';
import { FilterManager } from '@/common/queries/filter.manager';
import { Token } from '@/tokens/enities/token.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const a = this.userRepository.createQueryBuilder('u');

    a.leftJoinAndSelect('u.refresh_tokens', 't');

    const b = new FilterManager<User>(a);

    b.applyInFilter('locale', ['ru']);

    return await a.getMany();
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findByIdOrFail(id: number): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new UserNotFoundException(id);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
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

    return await this.userRepository.save(user);
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async changeLocale(user: User, locale: string) {
    await this.userRepository.update(user.id, {
      locale,
    });
  }

  setLocaleCookie(res: Response, locale: string) {
    res.cookie(LOCALE_COOKIE, locale);
  }
}
