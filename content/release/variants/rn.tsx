// app.config.ts: one config, switched by an env var per EAS profile
import type { ExpoConfig } from 'expo/config';

const variant = process.env.APP_VARIANT ?? 'production';
const isProd = variant === 'production';
const id = isProd ? 'com.acme.todos' : `com.acme.todos.${variant}`;

export default (): ExpoConfig => ({
  name: isProd ? 'Todos' : `Todos (${variant})`,
  slug: 'todos',
  version: '1.4.0',
  ios: { bundleIdentifier: id, buildNumber: '42' },
  android: { package: id, versionCode: 42 },
  extra: {
    apiUrl: isProd ? 'https://api.acme.com' : 'https://staging.api.acme.com',
  },
});

// Read it at runtime
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig?.extra?.apiUrl as string;
