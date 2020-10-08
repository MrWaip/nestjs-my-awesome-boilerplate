import { Module } from '@nestjs/common';
import { NavController } from './nav.controller';

@Module({
  controllers: [NavController]
})
export class NavModule {}
