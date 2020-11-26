import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { getFiltersFromQueryString } from './filter.decorator';
import { getPaginationFromQueryString } from './pagination.decorator';
import { getSortFromQueryString } from './sort.decorator';
import { QueryOptions } from './types';

export const InjectQueryOptions = createParamDecorator(
  (defaultOption: Partial<QueryOptions> | undefined, ctx: ExecutionContext): QueryOptions => {
    const { query } = ctx.switchToHttp().getRequest<Request>();

    const filters = getFiltersFromQueryString(query);
    const sort = getSortFromQueryString(query, defaultOption?.sort);
    const pagination = getPaginationFromQueryString(query, defaultOption?.pagination);

    return { filters, pagination, sort };
  },
);
