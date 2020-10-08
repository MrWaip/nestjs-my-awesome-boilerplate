import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const getCorsOptions = (): CorsOptions => ({
  origin: ['http://localhost:8080', 'localhost:8080'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
});
