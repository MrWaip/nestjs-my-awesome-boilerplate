import { User } from '@/users/entities/user.entity';
import { DeviceInfo } from '../auth.types';

export class CreateTokenPairDto {
  user: User;
  deviceInfo: DeviceInfo;
}
