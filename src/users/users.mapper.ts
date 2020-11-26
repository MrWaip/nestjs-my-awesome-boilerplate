import { User } from '@/users/entities/user.entity';
import { UserSelf } from './view-models/user.self';
import { Injectable } from '@nestjs/common';
import { PaginatedUsersDto } from './dto/paginated-users.dto';
import { UserPagination } from './view-models/user.pagination';

@Injectable()
export class UsersMapper {
  toPagination(users: PaginatedUsersDto[], timezone: string): UserPagination[] {
    return users.map<UserPagination>(user => new UserPagination(user, timezone));
  }

  toSelf(user: User): UserSelf {
    return new UserSelf(user);
  }
}
