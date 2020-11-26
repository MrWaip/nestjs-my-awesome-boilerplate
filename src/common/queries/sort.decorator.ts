import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { isArray } from 'lodash';
import { SortOptions, SortQueryString } from './types';

export const InjectSortOptions = createParamDecorator((defaultOptions: unknown, ctx: ExecutionContext) => {
  const { query } = ctx.switchToHttp().getRequest<Request<any, any, any, SortQueryString>>();
  return getSortFromQueryString(query, defaultOptions as SortOptions);
});

export const getSortFromQueryString = (query: SortQueryString, defaultSort?: SortOptions): SortOptions => {
  const sorts = parseSort(query.sort);
  if (Object.keys(sorts).length === 0 && defaultSort) return defaultSort;
  return sorts;
};

const parseSort = (str: string | string[] | undefined): SortOptions => {
  const sorts: SortOptions = {};
  if (!str) return sorts;
  if (isArray(str)) {
    for (const sort of str) {
      try {
        const rawSort = JSON.parse(sort);
        if (!isArray(rawSort)) continue;
        if (rawSort.length != 2) continue;
        const order = String(rawSort[1]).toUpperCase();
        if (!['ASC', 'DESC'].includes(order)) continue;
        sorts[rawSort[0]] = order === 'ASC' ? 'ASC' : 'DESC';
      } catch (error) {
        continue;
      }
    }
  }
  return sorts;
};
