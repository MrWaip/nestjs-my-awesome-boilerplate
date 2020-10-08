import { SetLocale } from './dto/set-locale.dto';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Body, Controller, Get, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { JoiValidationPipe } from 'src/common/pipes/joi-validation.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { createUserSchema } from './schemas/users.schema';
import { UsersService } from './users.service';
import { UserPagination } from './transformers/user.pagination';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UsersService, private configService: ConfigService) {}

  @Get()
  async findAll() {
    const users = (await this.userService.findAll()).map<UserPagination>(user => {
      return new UserPagination(user);
    });

    return {
      count: 10,
      users,
    };
  }

  @Post()
  @UsePipes(new JoiValidationPipe(createUserSchema))
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('self')
  async self(@Req() req: Request) {
    const fallback_locale = this.configService.get<string>('fallback_locale');
    const user = req.user as User;
    this.userService.setLocaleCookie(req.res, user.locale || fallback_locale);

    return user;
  }

  @Post('locale')
  async setLocale(@Req() req: Request<any, any, SetLocale>) {
    const user = req.user as User;
    const locale = req.body.locale;

    await this.userService.changeLocale(user, locale);
    this.userService.setLocaleCookie(req.res, locale);
  }
}
