export type AuthConfig = {
  jwt_secret: string;
  refresh_token_ttl: number;
  access_token_ttl: number;
  refresh_sessions_count: number;
};
