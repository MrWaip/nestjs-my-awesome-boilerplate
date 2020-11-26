import { parseEnvInt } from '@/common/functions/parseInt';
import {
  DEFAULT_REFRESH_TOKEN_TTL,
  DEFAULT_ACCESS_TOKEN_TTL,
  DEFAULT_REFRSH_SESSION_COUNT,
} from '@/auth/constants';

export default () => ({
  auth: {
    jwt_secret: process.env.AUTH_JWT_SECRET,
    refresh_token_ttl: parseEnvInt(process.env.AUTH_REFRESH_TOKEN_TTL, DEFAULT_REFRESH_TOKEN_TTL),
    access_token_ttl: parseEnvInt(process.env.AUTH_ACCESS_TOKEN_TTL, DEFAULT_ACCESS_TOKEN_TTL),
    refresh_sessions_count: parseEnvInt(process.env.AUTH_REFRSH_SESSION_COUNT, DEFAULT_REFRSH_SESSION_COUNT),
  },
  fallback_locale: process.env.FALLBACK_LOCALE,
});
