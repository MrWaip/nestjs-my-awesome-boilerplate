import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { userProviders } from './users.providers';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [UserController],
  providers: [...userProviders, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
