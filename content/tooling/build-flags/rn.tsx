// __DEV__: true in dev builds, false in release // @link:flag
const API_URL = __DEV__ // @link:url
  ? 'http://localhost:3000' // @link:dev-url
  : 'https://api.example.com'; // @link:prod-url

// Expo inlines EXPO_PUBLIC_* vars at build time // @link:generated
const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN; // @link:generated

if (__DEV__) { // @link:debug-check
  console.log('Using API', API_URL); // @link:log
}
