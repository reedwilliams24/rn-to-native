// __DEV__: true in dev builds, false in release
const API_URL = __DEV__
  ? 'http://localhost:3000'
  : 'https://api.example.com';

// Expo inlines EXPO_PUBLIC_* vars at build time
const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

if (__DEV__) {
  console.log('Using API', API_URL);
}
