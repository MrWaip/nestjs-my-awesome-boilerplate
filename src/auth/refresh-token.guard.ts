import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import {
  RefreshTokenNotRecognizedException,
  InvalidRefreshTokenException,
  UnknownRefreshTokenException,
  RefreshTokenExpiredException,
} from './auth.exceptions';
import { RefreshSessionsService } from '@/refresh-sessions/refresh-sessions.service';
import { Request } from 'express';
import { REFRESH_TOKEN_COOKIE } from './constants';
import { UUIDv4 } from 'uuid-v4-validator';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private refreshSessionService: RefreshSessionsService) {}

  async canActivate(ctx: ExecutionContext) {
    const req: Request = ctx.switchToHttp().getRequest();

    const refreshToken: string = req.cookies[REFRESH_TOKEN_COOKIE] ?? req.body['refreshToken'];

    if (!refreshToken) throw new RefreshTokenNotRecognizedException();

    if (!UUIDv4.validate(refreshToken)) throw new InvalidRefreshTokenException();

    const session = await this.refreshSessionService.findByRefreshToken(refreshToken);

    if (!session) throw new UnknownRefreshTokenException();

    if (new Date(session.expires_in) < new Date()) throw new RefreshTokenExpiredException();

    req.user = session.user;
    req.body.refresh_session = session;

    return true;
  }
}
