import { Controller, Post, UseGuards, Res, Request } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Response, Request as ReqType } from 'express';
import { User } from '@/users/entities/user.entity';
import { TokensService } from '@/tokens/tokens.service';
import { RefreshTokenGuard } from './refresh-token.guard';
import { Token } from '@/tokens/enities/token.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private tokenService: TokensService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: ReqType, @Res() res: Response) {
    const user = req.user as User;
    const ip: string = req.ip;
    const tokenPair = await this.authService.login(user, ip);
    this.authService.setRefreshTokenCookie(
      res,
      tokenPair.refresh_token,
      this.tokenService.getDateByExpiry(tokenPair.refresh_token_expiry),
    );

    res.send({
      access_token: tokenPair.access_token,
      access_token_expiry: tokenPair.access_token_expiry,
    });
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshToken(@Request() req: ReqType, @Res() res: Response) {
    const user = req.user as User;
    const ip: string = req.ip;
    const refresh_token: Token = req.body.refresh_token;

    const tokenPair = await this.authService.refreshTokenPair(refresh_token, user, ip);
    this.authService.setRefreshTokenCookie(
      res,
      tokenPair.refresh_token,
      this.tokenService.getDateByExpiry(tokenPair.refresh_token_expiry),
    );

    res.send({
      access_token: tokenPair.access_token,
      access_token_expiry: tokenPair.access_token_expiry,
    });
  }
}
