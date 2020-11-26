import { Module } from '@nestjs/common';
import { RefreshSessionsService } from './refresh-sessions.service';
import { UsersModule } from '@/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RefreshSessionsRepository } from './refresh-sessions.repository';

@Module({
  imports: [UsersModule, ConfigModule, TypeOrmModule.forFeature([RefreshSessionsRepository])],
  providers: [RefreshSessionsService],
  exports: [RefreshSessionsService],
})
export class RefreshSessionsModule {}
