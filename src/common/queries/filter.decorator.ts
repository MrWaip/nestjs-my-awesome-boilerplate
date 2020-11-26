import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { isArray } from 'lodash';
import { DateTime } from 'luxon';
import { IntervalPresets, Filter, FilterQueryString, ParseResult, SearchModes } from './types';

export const InjectFilters = createParamDecorator((filterClass: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<Request<any, any, any, FilterQueryString>>();
  return getFiltersFromQueryString(req.query);
});

export const getFiltersFromQueryString = (query: FilterQueryString): Filter[] => {
  const filtersQS = query.filters;

  const filters: Filter[] = [];

  if (filtersQS) {
    const parsedFilters = JSON.parse(filtersQS);
    if (typeof parsedFilters === 'object') {
      for (const filterKey in parsedFilters) {
        const filter = parseFilter(parsedFilters[filterKey]);
        if (!filter) continue;

        filters.push({
          name: filterKey,
          prop: filter,
        });
      }
    }
  }

  return filters;
};

const parseFilter = (filter: any): ParseResult | null => {
  if (!filter) return null;

  if (typeof filter !== 'object' || isArray(filter)) {
    return {
      value: filter,
      options: {},
    };
  }

  // Если SearchFilter
  if (filter?.value) {
    return {
      value: filter?.value,
      options: { mode: parseFilterMode(filter?.inverse == true, filter?.like == true) },
    };
  }

  // если InFilter
  if (filter?.items) {
    const items = isArray(filter.items) ? filter.items : [filter.items];
    return {
      value: items,
      options: { inverse: filter?.inverse == true },
    };
  }

  // если RangeFilter
  if (filter?.startDate || filter?.endDate || filter?.interval) {
    const interval = Object.values(IntervalPresets).includes(filter?.interval) ? filter?.interval : null;
    let start: DateTime | null = DateTime.fromISO(filter?.startDate || '');
    let end: DateTime | null = DateTime.fromISO(filter?.endDate || '');

    if (!start.isValid) start = null;
    if (!end.isValid) end = null;

    return { value: { start, end, interval }, options: {} };
  }

  return null;
};

const parseFilterMode = (inverse: boolean, like: boolean): SearchModes => {
  if (like && inverse) {
    return SearchModes.NOT_LIKE;
  } else if (like && !inverse) {
    return SearchModes.LIKE;
  } else if (!like && inverse) {
    return SearchModes.NOT_EQUAL;
  } else if (!like && !inverse) {
    return SearchModes.EQUAL;
  }

  return SearchModes.EQUAL;
};
