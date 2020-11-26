import { SelectQueryBuilder } from 'typeorm';
import { PaginationOptions, SortOptions } from './types';

export class QueryManager<Entity extends any> {
  paginate(qb: SelectQueryBuilder<Entity>, { limit, page }: PaginationOptions): SelectQueryBuilder<Entity> {
    let offset = limit * (page - 1);
    offset = Math.round(offset);

    if (offset < 0) offset = 0;
    if (limit <= 0) limit = 50;

    qb.skip(offset);
    qb.take(limit);

    return qb;
  }

  sort(qb: SelectQueryBuilder<Entity>, sorts: SortOptions): SelectQueryBuilder<Entity> {
    const alias = qb.alias;
    for (const column in sorts) {
      qb.orderBy(`${alias}.${column}`, sorts[column]);
    }

    return qb;
  }
}
