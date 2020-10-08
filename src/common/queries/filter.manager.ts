import { SelectQueryBuilder } from 'typeorm';

type InFilterOptions = {
  inverse?: boolean;
  useAlias?: boolean;
};

export class FilterManager<Entity> {
  private builder: SelectQueryBuilder<Entity>;

  constructor(builder: SelectQueryBuilder<Entity>) {
    this.builder = builder;
  }

  public applyInFilter(column_expression: string, items: any[], options?: InFilterOptions) {
    if (items.length === 0) return;

    this.builder.connection.driver.database === '' 

    const notIn = options?.inverse === true;
    const useAlias = options?.useAlias === true;

    const alias = useAlias ? `${this.builder.alias}.` : '';
    const operator = notIn ? '!=' : '=';

    this.builder.andWhere(`${alias}${column_expression} ${operator} ANY(:items)`, { items });
  }
}
