import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { RefreshSessionsModule } from '@/refresh-sessions/refresh-sessions.module';
import { jwtConfig } from '@/config/jwt.config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync(jwtConfig),
    UsersModule,
    PassportModule,
    RefreshSessionsModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
