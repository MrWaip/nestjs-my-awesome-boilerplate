import { RefreshSession } from '@/refresh-sessions/enities/refresh-session.entity';
import { User } from '@/users/entities/user.entity';
import { DeviceInfo } from '../auth.types';

export class RefreshSessionDto {
  session: RefreshSession;
  user: User;
  deviceInfo: DeviceInfo;
}
