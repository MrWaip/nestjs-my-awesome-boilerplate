import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { DatabaseModule } from '@/database/database.module';
import { tokensProviders } from './tokens.provider';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule],
  providers: [...tokensProviders, TokensService],
  exports: [TokensService],
})
export class TokensModule {}
