import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInfo } from '../auth.types';

export const UserId = createParamDecorator((data: unknown, ctx: ExecutionContext): string | null => {
  const request = ctx.switchToHttp().getRequest<{ user?: UserInfo }>();
  return request.user?.userId ?? null;
});
