import { Response } from 'express';
import { PRODUCTION } from './../common/constants';
import { REFRESH_TOKEN_COOKIE } from './constants';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/entities/user.entity';
import { TokensService } from '@/tokens/tokens.service';
import { TokenPair } from './types';
import { Token } from '@/tokens/enities/token.entity';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from '@/config/types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokensService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pwd: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pwd, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User, ip: string): Promise<TokenPair> {
    const tokenPair = this.createTokenPair(user);

    await this.tokenService.saveRefreshToken({
      expiry: tokenPair.refresh_token_expiry,
      user_id: user.id,
      value: tokenPair.refresh_token,
      ip,
    });

    return tokenPair;
  }

  createTokenPair(user: User): TokenPair {
    const payload = { sub: user.id };
    const { refresh_expiry, access_expiry } = this.configService.get<AuthConfig>('auth');

    const access_token = this.jwtService.sign(payload, {
      expiresIn: access_expiry,
    });

    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: refresh_expiry,
    });

    return {
      access_token,
      refresh_token,
      access_token_expiry: access_expiry,
      refresh_token_expiry: refresh_expiry,
    };
  }

  /**
   * Создание новой пары токенов, через refresh_token
   * @param token - Refresh token используемый для создания новой пары токенов
   * @param ip  - IP с которого поступил запрос
   */
  async refreshTokenPair(token: Token, user: User, ip: string) {
    const tokenPair = this.createTokenPair(user);

    await this.tokenService.delete(token);

    await this.tokenService.saveRefreshToken({
      expiry: tokenPair.refresh_token_expiry,
      user_id: user.id,
      value: tokenPair.refresh_token,
      ip,
    });

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
