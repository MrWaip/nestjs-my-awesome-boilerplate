import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { CliModule } from './cli/cli.module';
(async () => {
  let logger = true;

  const logArgIndex = process.argv.findIndex(i => i === '--log');
  if (logArgIndex >= 0) {
    process.argv.splice(logArgIndex, 1);
    logger = undefined;
  }

  const app = await NestFactory.createApplicationContext(CliModule, { logger });
  app
    .select(CommandModule)
    .get(CommandService)
    .exec();
})();
