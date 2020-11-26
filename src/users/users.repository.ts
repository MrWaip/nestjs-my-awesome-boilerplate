import { QueryManager } from '@/common/queries/query.manager';
import { PaginationResult, QueryOptions } from '@/common/queries/types';
import { EntityRepository, Repository } from 'typeorm';
import { PaginatedUsersDto } from './dto/paginated-users.dto';
import { User } from './entities/user.entity';
import { UserFilter } from './user.filter';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async paginate(options: QueryOptions): Promise<PaginationResult<PaginatedUsersDto>> {
    const builder = this.manager.createQueryBuilder()
      .from(sb => {
        return sb
          .select([
            'u.id as id',
            'u.email as email',

            'u.created_at as created_at',
            'u.updated_at as updated_at',
            'u.deleted_at as deleted_at',

            'get_user_fullname(u.id::uuid) as fullname',
            'get_user_fullname(u.deleted_by::uuid) as deleted_by',
            'get_user_fullname(u.created_by::uuid) as created_by',

            'r.id as role_id',
            'translate(r.title_i18n, :locale) as role_title',
          ])
          .from('users', 'u')
          .leftJoin('u.role', 'r');
      }, 'sub')
      .select(['sub.*', 'count(*) OVER() AS full_count']);

    builder.setParameter('locale', 'ru');

    const qm = new QueryManager();
    const qf = new UserFilter(builder, options.filters);

    qm.sort(builder, options.sort);
    qf.filter();
    qm.paginate(builder, options.pagination);

    const result = await builder.getRawMany<PaginatedUsersDto>();
    const count = result.length > 0 ? parseInt(result[0].full_count) : 0;

    return [result, count];
  }
}
