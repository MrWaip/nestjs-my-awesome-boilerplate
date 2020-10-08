import { Token } from '@/tokens/enities/token.entity';
import { User } from '../entities/user.entity';
import { capitalize } from 'lodash';

export class UserPagination {
  id: number;

  full_name: string;

  tokens: Token[];

  public constructor(user: User) {
    this.id = user.id;
    this.tokens = user.refresh_tokens;
    this.full_name = [user.lname, user.fname, user.mname || ''].map(w => capitalize(w)).join(' ');
  }
}
