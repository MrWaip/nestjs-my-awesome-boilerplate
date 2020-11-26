import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JoiValidationPipe } from 'src/common/pipes/joi-validation.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { createUserSchema } from './schemas/users.schema';
import { UsersService } from './users.service';
import { FALLBACK_LOCALE } from '@/config/constants';
import { InjectQueryOptions } from '@/common/queries/query-options.decorator';
import { QueryOptions } from '@/common/queries/types';
import { Tz } from '@/common/decorators/timezone.decorator';
import { UserId } from '@/auth/decorators/user-id.decorator';
import { UsersMapper } from './users.mapper';
import { UsersRepository } from './users.repository';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private usersRepository: UsersRepository,
    private userService: UsersService,
    private configService: ConfigService,
    private usersMapper: UsersMapper,
  ) {}

  @Get()
  async get(@InjectQueryOptions() queryOptions: QueryOptions, @Tz() timezone: string) {
    const [rawUsers, count] = await this.usersRepository.paginate(queryOptions);
    const users = this.usersMapper.toPagination(rawUsers, timezone);
    return { count, users };
  }

  @Post()
  async create(
    @I18n() i18n: I18nContext,
    @Body(new JoiValidationPipe(createUserSchema)) createUserDto: CreateUserDto,
  ) {
    const user = await this.userService.create(createUserDto);

    return {
      user_id: user.id,
      message: await i18n.t('users.createdSuccessfuly'),
    };
  }

  @Get('self')
  async self(@Req() req: Request, @UserId() userId: string) {
    const fallback_locale = this.configService.get<string>('fallback_locale', FALLBACK_LOCALE);
    const userEntity = await this.userService.findByIdOrFail(userId);
    const user = this.usersMapper.toSelf(userEntity);
    const locale = user.locale || fallback_locale;
    const timezone = user.timezone;
    this.userService.setLocaleCookie(req.res as Response, locale);
    this.userService.setTimezoneCookie(req.res as Response, timezone);

    return user;
  }

  @Post('locale')
  async setLocale(@Body('locale') locale: string, @UserId() userId: string, @Res() res: Response) {
    const user = await this.userService.findByIdOrFail(userId);
    await this.userService.changeLocale(user, locale);
    this.userService.setLocaleCookie(res, locale);
    res.send();
  }
}
