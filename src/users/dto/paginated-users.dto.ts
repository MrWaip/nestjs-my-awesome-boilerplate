export class PaginatedUsersDto {
  id: string;
  email: string;
  fullname: string;

  created_at: string;
  updated_at: string;
  deleted_at?: string;

  deleted_by?: string;
  created_by?: string;

  deleted_id?: string;
  created_id?: string;

  role_title?: string;
  role_id?: number;

  full_count: string;
}
