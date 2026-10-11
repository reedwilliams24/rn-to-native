import messaging from '@react-native-firebase/messaging'; // @link:import

export async function registerForPush() { // @link:register
  const status = await messaging().requestPermission(); // @link:ask
  if (status !== messaging.AuthorizationStatus.AUTHORIZED) return; // @link:ask

  const token = await messaging().getToken(); // @link:token
  await api.registerDevice(token); // @link:send
}

messaging().onTokenRefresh((token) => api.registerDevice(token)); // @link:refresh
messaging().onMessage(async (message) => showInAppBanner(message)); // @link:message
