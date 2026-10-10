import messaging from '@react-native-firebase/messaging';

export async function registerForPush() {
  const status = await messaging().requestPermission();
  if (status !== messaging.AuthorizationStatus.AUTHORIZED) return;

  const token = await messaging().getToken();
  await api.registerDevice(token);
}

messaging().onTokenRefresh((token) => api.registerDevice(token));
messaging().onMessage(async (message) => showInAppBanner(message));
