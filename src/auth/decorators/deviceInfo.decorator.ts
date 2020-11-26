import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { DeviceInfo } from '../auth.types';

export const InjectDeviceInfo = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();
  const deviceInfo: DeviceInfo = {
    ip: request.ip,
    userAgent: request.useragent?.source,
  };

  return deviceInfo;
});
