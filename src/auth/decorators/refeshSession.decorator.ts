import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const InjectRefreshSession = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.body.refresh_session;
});
