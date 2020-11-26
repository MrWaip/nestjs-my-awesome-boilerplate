import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { UsersMapper } from './users.mapper';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([UsersRepository])],
  controllers: [UserController],
  providers: [UsersMapper, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
