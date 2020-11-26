import { Controller, Post, UseGuards, Req, Res } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Request as ReqType, Response } from 'express';
import { User } from '@/users/entities/user.entity';
import { RefreshTokenGuard } from './refresh-token.guard';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshSessionDto } from './dto/refresh-session.dto';
import { RefreshSession } from '@/refresh-sessions/enities/refresh-session.entity';
import { DeviceInfo, TokenPair } from './auth.types';
import { InjectUser } from './decorators/user.decorator';
import { InjectDeviceInfo } from './decorators/deviceInfo.decorator';
import { InjectRefreshSession } from './decorators/refeshSession.decorator';
import { RefreshSessionsService } from '@/refresh-sessions/refresh-sessions.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private refreshSessionsService: RefreshSessionsService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(
    @InjectUser() user: User,
    @InjectDeviceInfo() deviceInfo: DeviceInfo,
    @Req() req: ReqType,
  ): Promise<TokenPair> {
    const signInDto: SignInDto = { deviceInfo, user };
    const tokenPair = await this.authService.signIn(signInDto);

    this.authService.setRefreshTokenCookie(
      req.res as Response,
      tokenPair.refreshToken,
      new Date(tokenPair.refreshTokenExpiresIn),
    );

    return tokenPair;
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshToken(
    @InjectUser() user: User,
    @InjectDeviceInfo() deviceInfo: DeviceInfo,
    @InjectRefreshSession() session: RefreshSession,
    @Req() req: ReqType,
  ): Promise<TokenPair> {
    const refreshSessionDto: RefreshSessionDto = { deviceInfo, user, session };
    const tokenPair = await this.authService.refreshSession(refreshSessionDto);

    this.authService.setRefreshTokenCookie(
      req.res as Response,
      tokenPair.refreshToken,
      new Date(tokenPair.refreshTokenExpiresIn),
    );

    return tokenPair;
  }

  @UseGuards(RefreshTokenGuard)
  @Post('signout')
  async signOut(@InjectRefreshSession() session: RefreshSession, @Res() res: Response): Promise<void> {
    // Очищаем refresh куку
    this.authService.setRefreshTokenCookie(res, '', new Date(0));
    await this.refreshSessionsService.delete(session);
    res.send();
  }
}
