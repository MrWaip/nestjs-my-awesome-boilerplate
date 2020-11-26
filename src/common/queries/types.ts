import { DateTime } from 'luxon';
import { SelectQueryBuilder } from 'typeorm';

export interface InFilterOptions {
  inverse?: boolean;
  useAlias?: boolean;
}

export enum SearchModes {
  LIKE = 'like',
  NOT_LIKE = 'not like',
  EQUAL = 'equal',
  NOT_EQUAL = 'not equal',
}

export type SearchOperators = '!=' | '=' | 'like' | 'not like';
export interface SearchFilterOptions {
  useAlias?: boolean;
  caseSensitivity?: boolean;
  mode?: SearchModes;
  defaultMode?: SearchModes;
  partial?: boolean;
}

export interface Range {
  start?: DateTime;
  end?: DateTime;
}

export interface RangeFilter extends Range {
  interval?: IntervalPresets;
}

export interface RangeFilterOptions {
  useAlias?: boolean;
}

export enum IntervalPresets {
  TODAY = 'today',
  YESTARDAY = 'yestarday',
  LAST_7_DAYS = 'last7Days',
  CURRENT_WEEK = 'currentWeek',
  LAST_WEEK = 'lastWeek',
  CURRENT_MONTH = 'currentMonth',
  LAST_MONTH = 'lastMonth',
}

export interface FilterQueryString {
  filters?: string;
}

export interface Filter {
  name: string;
  prop: ParseResult;
}

export type FilterProp = {
  value: any;
  options: { [key: string]: any };
};

export type RangeFilterProp = {
  value: RangeFilter;
  options: RangeFilterOptions;
};

export type InFilterProp = {
  value: any[];
  options: InFilterOptions;
};

export type SearchFilterProp = {
  value: string;
  options: SearchFilterOptions;
};

export type ParseResult = SearchFilterProp | RangeFilterProp | InFilterProp | FilterProp;

export interface PaginationQueryString {
  limit?: string;
  page?: string;
}

export interface SortQueryString {
  sort?: string[] | string;
}

export interface PaginationOptions {
  limit: number;
  page: number;
}

export interface SortOptions {
  [key: string]: 'ASC' | 'DESC';
}

export interface QueryOptions {
  sort: SortOptions;
  pagination: PaginationOptions;
  filters: Filter[];
}

export interface QueryFilterSchema<Entity = any> {
  new (qb: SelectQueryBuilder<Entity>, filters: Filter[]);
}

export type PaginationResult<Entity = any> = [Entity[], number];
