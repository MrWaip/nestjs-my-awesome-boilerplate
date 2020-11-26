import { DateTime } from 'luxon';

export interface TokenPair {
  refreshToken: string;
  refreshTokenExpiresIn: number;
  accessToken: string;
  accessTokenExpiresIn: number;
}

export interface AccessTokenPayload {
  sub: string;
}

export interface AccessToken {
  token: string;
  expiresIn: DateTime;
}

export interface DeviceInfo {
  userAgent?: string;
  fingerprint?: string;
  ip: string;
}

export interface UserInfo {
  userId: string;
}
