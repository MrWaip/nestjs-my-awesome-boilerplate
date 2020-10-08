import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { ExampleCommand } from './example.command';
@Module({
  imports: [CommandModule],
  providers: [ExampleCommand],
})
export class CliModule {}
