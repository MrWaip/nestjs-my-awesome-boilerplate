import { Injectable } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { DateTime } from 'luxon';
import { CreateRefreshSessionDto } from './dto/create-refresh-session.dto';
import { RefreshSession } from './enities/refresh-session.entity';
import { UUIDv4 } from 'uuid-v4-validator';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from '@/config/types';
import { RefreshSessionsRepository } from './refresh-sessions.repository';
import { DEFAULT_REFRESH_TOKEN_TTL, DEFAULT_REFRSH_SESSION_COUNT } from '@/auth/constants';

@Injectable()
export class RefreshSessionsService {
  constructor(
    private repository: RefreshSessionsRepository,
    private configService: ConfigService,
    private userService: UsersService,
  ) {}

  async createRefreshSession(createDto: CreateRefreshSessionDto): Promise<RefreshSession> {
    const { deviceInfo, userId } = createDto;
    const refreshTtl =
      this.configService.get<AuthConfig>('auth')?.refresh_token_ttl || DEFAULT_REFRESH_TOKEN_TTL;

    const user = await this.userService.findByIdOrFail(userId);

    const refreshSession = new RefreshSession();
    refreshSession.user = user;
    refreshSession.ip = deviceInfo.ip;
    refreshSession.user_agent = deviceInfo.userAgent;
    refreshSession.fingerprint = deviceInfo.fingerprint;
    refreshSession.refresh_token = UUIDv4.generate();
    refreshSession.expires_in = DateTime.local()
      .plus({ seconds: refreshTtl })
      .toMillis();

    return await this.repository.save(refreshSession);
  }

  async findByRefreshToken(refresh_token: string): Promise<RefreshSession | undefined> {
    return await this.repository.findOne({ relations: ['user'], where: { refresh_token } });
  }

  async findByUserId(userId: string): Promise<RefreshSession[]> {
    return await this.repository.find({
      where: { user_id: userId },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async delete(refreshSession: RefreshSession): Promise<void> {
    await this.repository.delete(refreshSession.id);
  }

  async validateUserSessions(userId: string) {
    const maxSessionCount =
      this.configService.get<AuthConfig>('auth')?.refresh_sessions_count || DEFAULT_REFRSH_SESSION_COUNT;
    const sessionCount = await this.repository.countByUserId(userId);

    if (sessionCount > maxSessionCount) {
      await this.repository.deleteByUserIdExceptLast(userId);
    } else {
      await this.repository.deleteExpiredByUserId(userId);
    }
  }
}
