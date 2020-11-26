import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { DEFAULT_TIMEZONE, TIMEZONE_COOKIE, TIMEZONE_HEADER } from '../constants';

export const Tz = createParamDecorator((defaultTz: unknown, ctx: ExecutionContext) => {
  const { cookies, headers } = ctx.switchToHttp().getRequest<Request>();
  const tz: string = cookies[TIMEZONE_COOKIE] ?? headers[TIMEZONE_HEADER] ?? defaultTz ?? DEFAULT_TIMEZONE;
  return tz;
});
