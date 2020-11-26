import { User } from '@/users/entities/user.entity';
import { DeviceInfo } from '../auth.types';

export class SignInDto {
  deviceInfo: DeviceInfo;
  user: User;
}
