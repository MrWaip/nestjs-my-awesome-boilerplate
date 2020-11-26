import { DateTimeFormats, formatDateTime } from '@/common/functions/datetime.functions';
import { Role } from '../role.entity';

export class RoleSimple {
  title: string;
  id: number;
  
  created_at: string;
  updated_at: string;

  constructor(role: Role, toTimezone: string) {


    this.created_at = formatDateTime(role.created_at, DateTimeFormats.FULL_DATE_TIME, { toTimezone });
    this.updated_at = formatDateTime(role.updated_at, DateTimeFormats.FULL_DATE_TIME, { toTimezone });
  }
}
