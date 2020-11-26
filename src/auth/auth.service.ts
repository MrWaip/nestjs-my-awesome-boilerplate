import { Response } from 'express';
import { PRODUCTION } from './../common/constants';
import { DEFAULT_ACCESS_TOKEN_TTL, REFRESH_TOKEN_COOKIE } from './constants';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/entities/user.entity';
import { RefreshSessionsService } from '@/refresh-sessions/refresh-sessions.service';
import { AccessTokenPayload, AccessToken, TokenPair } from './auth.types';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from '@/config/types';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { DateTime } from 'luxon';
import { CreateTokenPairDto } from './dto/create-token-pair.dto';
import { RefreshSessionDto } from './dto/refresh-session.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private refreshSessionsService: RefreshSessionsService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pwd: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pwd, user.password))) {
      return user;
    }
    return null;
  }

  async signIn({ user, deviceInfo }: SignInDto): Promise<TokenPair> {
    return await this.createTokenPair({
      deviceInfo,
      user,
    });
  }

  async createTokenPair({ deviceInfo, user }: CreateTokenPairDto): Promise<TokenPair> {
    const refreshSession = await this.refreshSessionsService.createRefreshSession({
      deviceInfo,
      userId: user.id,
    });

    const accessToken = this.createAccessToken(user);

    await this.refreshSessionsService.validateUserSessions(user.id);

    return {
      accessToken: accessToken.token,
      accessTokenExpiresIn: accessToken.expiresIn.toMillis(),
      refreshToken: refreshSession.refresh_token,
      refreshTokenExpiresIn: refreshSession.expires_in,
    };
  }

  createAccessToken(user: User): AccessToken {
    const payload: AccessTokenPayload = { sub: user.id };
    const accessTtl =
      this.configService.get<AuthConfig>('auth')?.access_token_ttl || DEFAULT_ACCESS_TOKEN_TTL;

    const token = this.jwtService.sign(payload, { expiresIn: accessTtl });
    const expiresIn = DateTime.local().plus({ seconds: accessTtl });

    return { token, expiresIn };
  }

  async refreshSession(refreshSessionDto: RefreshSessionDto): Promise<TokenPair> {
    const { deviceInfo, session, user } = refreshSessionDto;

    await this.refreshSessionsService.delete(session);
    const tokenPair = await this.createTokenPair({ deviceInfo, user });

    return tokenPair;
  }

  setRefreshTokenCookie(res: Response, refresh_token: string, expires: Date) {
    const isProd = process.env.NODE_ENV === PRODUCTION;

    res.cookie(REFRESH_TOKEN_COOKIE, refresh_token, {
      expires: expires,
      httpOnly: isProd,
      secure: isProd,
    });
  }
}
