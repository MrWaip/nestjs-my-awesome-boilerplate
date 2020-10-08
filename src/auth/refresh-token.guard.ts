import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import {
  RefreshTokenNotRecognizedException,
  InvalidRefreshTokenException,
  UnknownRefreshTokenException,
} from './auth.exceptions';
import { TokensService } from '@/tokens/tokens.service';
import { REFRESH_TOKEN_COOKIE } from './constants';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private jwtService: JwtService, private tokenService: TokensService) {}

  async canActivate(ctx: ExecutionContext) {
    const req: Request = ctx.switchToHttp().getRequest();

    const refresh_token: string = req.cookies[REFRESH_TOKEN_COOKIE] ?? req.body['refresh_token'];

    if (!refresh_token) throw new RefreshTokenNotRecognizedException();

    try {
      this.jwtService.verify(refresh_token);
    } catch (error) {
      throw new InvalidRefreshTokenException();
    }

    const token = await this.tokenService.findByValue(refresh_token);

    if (!token) throw new UnknownRefreshTokenException();

    req.user = token.user;
    token.user = null;
    req.body.refresh_token = token;

    return true;
  }
}
