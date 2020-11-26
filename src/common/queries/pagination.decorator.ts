import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { PaginationOptions, PaginationQueryString } from './types';

export const InjectPagination = createParamDecorator((defaultOptions: unknown, ctx: ExecutionContext) => {
  const { query } = ctx.switchToHttp().getRequest<Request<any, any, any, PaginationQueryString>>();
  return getPaginationFromQueryString(query, defaultOptions as PaginationOptions);
});

export const getPaginationFromQueryString = (
  query: PaginationQueryString,
  defaultOptions?: PaginationOptions,
): PaginationOptions => {
  let limit: number = defaultOptions?.limit || 50;
  let page: number = defaultOptions?.page || 1;

  if (query?.limit) limit = parseInt(query?.limit);
  if (query?.page) page = parseInt(query?.page);

  return { limit, page };
};
