import { User } from './../entities/user.entity';
import { Role } from './../../roles/role.entity';

export class UserSelf {
  id: string;
  email: string;
  fname: string;
  mname: string;
  lname: string;
  timezone: string;
  locale: string;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
  deleted_by?: User;
  created_by?: User;
  role?: Role;

  constructor(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...other } = user;
    Object.assign(this, other);
  }
}
