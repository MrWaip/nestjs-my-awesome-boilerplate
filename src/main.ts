import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors.config';
import { parseEnvInt } from './common/functions/parseInt';

import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as helmet from 'helmet';
import * as userAgent from 'express-useragent';
import { ExceptionI18nFilter } from './common/filters/exception-i18n.filter';
import { I18nService } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = parseEnvInt(process.env.PORT, 3000);

  app.use(helmet());
  app.use(cookieParser());
  app.use(morgan('tiny'));
  app.enableCors(corsConfig());
  app.use(userAgent.express());

  app.useGlobalFilters(new ExceptionI18nFilter(app.get(I18nService)));

  await app.listen(port);
  console.log(`Server running on ${port}`);
}
bootstrap();
