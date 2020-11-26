import { DateTime, Interval } from 'luxon';
import { SelectQueryBuilder } from 'typeorm';
import {
  Filter,
  InFilterOptions,
  IntervalPresets,
  RangeFilter,
  RangeFilterOptions,
  SearchFilterOptions,
  SearchModes,
  SearchOperators,
} from './types';

export abstract class FilterManager<Entity = any> {
  protected builder: SelectQueryBuilder<Entity>;
  protected filters: Filter[];

  constructor(builder: SelectQueryBuilder<Entity>, filters: Filter[]) {
    this.builder = builder;
    this.filters = filters;
  }

  public setInFilter(column_expression: string, items: any[], options?: InFilterOptions) {
    if (items.length === 0) return;

    const notIn = options?.inverse === true;
    const useAlias = options?.useAlias === true;

    const alias = useAlias ? `${this.builder.alias}.` : '';
    const operator = notIn ? '!=' : '=';

    this.builder.andWhere(`${alias}${column_expression} ${operator} ANY(:items)`, { items });
  }

  setRangeFilter(column_expression: string, filter: RangeFilter, options?: RangeFilterOptions) {
    const { interval } = filter;
    let { start, end } = filter;

    const alias = options?.useAlias ? `${this.builder.alias}.` : '';

    if (interval) {
      const range = this.getRange(interval);
      if (range && range.isValid) {
        start = range.start;
        end = range.end;
      } else return;
    }

    if (!start || !end) return;

    this.builder.andWhere(`${alias}${column_expression} BETWEEN  :start AND :end`, {
      start: start.toISO(),
      end: end.toISO(),
    });
  }

  public getRange(interval: IntervalPresets): Interval | null {
    switch (interval) {
      case IntervalPresets.TODAY:
        return Interval.fromDateTimes(DateTime.local().startOf('day'), DateTime.local().endOf('day'));

      case IntervalPresets.YESTARDAY:
        return Interval.fromDateTimes(
          DateTime.local()
            .minus({ days: 1 })
            .startOf('day'),
          DateTime.local()
            .minus({ days: 1 })
            .endOf('day'),
        );
      case IntervalPresets.LAST_7_DAYS:
        return Interval.fromDateTimes(
          DateTime.local()
            .startOf('day')
            .minus({ days: 7 }),
          DateTime.local().endOf('day'),
        );

      case IntervalPresets.CURRENT_WEEK:
        return Interval.fromDateTimes(DateTime.local().startOf('week'), DateTime.local().endOf('week'));
      case IntervalPresets.CURRENT_MONTH:
        return Interval.fromDateTimes(DateTime.local().startOf('month'), DateTime.local().endOf('month'));

      case IntervalPresets.LAST_MONTH:
        return Interval.fromDateTimes(
          DateTime.local()
            .minus({ months: 1 })
            .startOf('month'),
          DateTime.local()
            .minus({ months: 1 })
            .endOf('month'),
        );
      default:
        return null;
    }
  }

  public setSearchFilter(column_expression: string, value: string, options?: SearchFilterOptions) {
    value = value.trim();

    if (!value) return;

    const operator: SearchOperators = this.getSearchOperator(
      options?.mode || options?.defaultMode || SearchModes.EQUAL,
    );
    const alias = options?.useAlias === true ? `${this.builder.alias}.` : '';
    const partial = options?.partial ?? true;

    let target = ':value';
    let source = `${alias}${column_expression}`;

    if (!options?.caseSensitivity) {
      source = `upper(cast(${source} as varchar))`;
      target = `upper(${target})`;
    }

    if (partial && (operator == 'like' || operator == 'not like')) {
      value = `%${value}%`;
    }

    this.builder.andWhere(`${source} ${operator} ${target}`, { value });
  }

  public getSearchOperator(mode: SearchModes): SearchOperators {
    let operator: SearchOperators = '=';

    switch (mode) {
      case SearchModes.EQUAL:
        operator = '=';
        break;
      case SearchModes.LIKE:
        operator = 'like';
        break;
      case SearchModes.NOT_LIKE:
        operator = 'not like';
        break;
      case SearchModes.NOT_EQUAL:
        operator = '!=';
        break;
    }

    return operator;
  }

  filter() {
    for (const { name, prop } of this.filters) {
      if (!this[name] && typeof this[name] !== 'function') continue;
      this[name](prop);
    }
  }
}
