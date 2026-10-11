// app.config.ts: one config, switched by an env var per EAS profile
import type { ExpoConfig } from 'expo/config';

const variant = process.env.APP_VARIANT ?? 'production'; // @link:variant
const isProd = variant === 'production';
const id = isProd ? 'com.acme.todos' : `com.acme.todos.${variant}`; // @link:bundle-id

export default (): ExpoConfig => ({
  name: isProd ? 'Todos' : `Todos (${variant})`, // @link:name
  slug: 'todos',
  version: '1.4.0', // @link:version
  ios: { bundleIdentifier: id, buildNumber: '42' }, // @link:build
  android: { package: id, versionCode: 42 }, // @link:build
  extra: {
    apiUrl: isProd ? 'https://api.acme.com' : 'https://staging.api.acme.com', // @link:api
  },
});

// Read it at runtime
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig?.extra?.apiUrl as string; // @link:read
