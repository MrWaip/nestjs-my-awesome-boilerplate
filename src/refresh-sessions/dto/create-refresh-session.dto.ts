import { DeviceInfo } from '@/auth/auth.types';

export class CreateRefreshSessionDto {
  userId: string;
  deviceInfo: DeviceInfo;
}
