import { DateTimeFormats, formatDateTime } from '@/common/functions/datetime.functions';
import { PaginatedUsersDto } from '../dto/paginated-users.dto';

export class UserPagination {
  id: string;
  email: string;
  fullname: string;

  timezone: string;
  locale: string;

  created_at: string;
  updated_at: string;
  deleted_at?: string;

  is_deleted: boolean;

  deleted_by?: string;
  created_by?: string;

  deleted_id?: string;
  created_id?: string;

  role_title?: string;
  role_id?: number;

  public constructor(user: PaginatedUsersDto, toTimezone: string) {
    const {
      id,
      fullname,
      email,
      role_id,
      role_title,
      created_by,
      deleted_by,
      deleted_at,
      created_at,
      updated_at,
    } = user;

    this.id = id;
    this.email = email;
    this.fullname = fullname;

    this.role_id = role_id;
    this.role_title = role_title;

    this.created_by = created_by;
    this.deleted_by = deleted_by;

    this.is_deleted = !!this.deleted_at;

    this.created_at = formatDateTime(created_at, DateTimeFormats.FULL_DATE_TIME, { toTimezone });
    this.updated_at = formatDateTime(updated_at, DateTimeFormats.FULL_DATE_TIME, { toTimezone });

    if (!!deleted_at)
      this.deleted_at = formatDateTime(deleted_at, DateTimeFormats.FULL_DATE_TIME, { toTimezone });
  }
}
