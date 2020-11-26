import { FilterManager } from '@/common/queries/filter.manager';
import { RangeFilterProp, SearchFilterProp } from '@/common/queries/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserFilter extends FilterManager {
  public email({ value, options }: SearchFilterProp) {
    this.setSearchFilter('email', value, options);
  }

  public fullname({ value, options }: SearchFilterProp) {
    this.setSearchFilter('fullname', value, options);
  }

  public createdAt({ value, options }: RangeFilterProp) {
    options.useAlias = true;
    this.setRangeFilter('created_at', value, options);
  }
}
