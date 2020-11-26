import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InvalidAccessTokenPayload } from '@/auth/auth.exceptions';
import { UUIDv4 } from 'uuid-v4-validator';
import { AccessTokenPayload, UserInfo } from './auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt_secret'),
    });
  }

  async validate({ sub }: AccessTokenPayload): Promise<UserInfo> {
    const isValidUUID = UUIDv4.validate(sub);
    if (!isValidUUID) throw new InvalidAccessTokenPayload();

    return { userId: sub };
  }
}
