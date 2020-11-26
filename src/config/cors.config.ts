import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsConfig = (): CorsOptions => ({
  origin: ['http://localhost:8080', 'localhost:8080', 'http://localhost:8081'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
});
