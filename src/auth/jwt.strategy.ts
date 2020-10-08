import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';
import { InvalidAccessTokenPayload } from '@/auth/auth.exceptions';
import { UUIDv4 } from 'uuid-v4-validator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt_secret'),
    });
  }

  async validate({ sub }: any) {
    const isValidUUID = UUIDv4.validate(sub);
    if (!isValidUUID) throw new InvalidAccessTokenPayload();

    const user = this.userService.findById(sub);
    if (!user) throw new InvalidAccessTokenPayload();

    return user;
  }
}
