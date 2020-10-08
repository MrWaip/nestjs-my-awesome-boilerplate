import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExampleCommand {
  @Command({ command: 'example', describe: 'Cli: custom command example', autoExit: true })
  async example() {
    console.log(`\x1b[32m[CLI]`, `Happy hacking!`);
  }
}
