export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  auth: {
    jwt_secret: process.env.AUTH_JWT_SECRET,
    refresh_expiry: parseInt(process.env.AUTH_REFRESH_EXPIRY) || 60 * 60 * 24 * 7,
    access_expiry: parseInt(process.env.AUTH_ACCESS_EXPIRY) || 60 * 20,
  },
  fallback_locale: process.env.FALLBACK_LOCALE || 'en',
});
