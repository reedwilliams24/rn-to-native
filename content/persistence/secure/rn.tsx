// expo-secure-store wraps Keystore (Android) and Keychain (iOS)
async function saveRefreshToken(token: string) {
  await SecureStore.setItemAsync('refreshToken', token);
}

async function readRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync('refreshToken');
}

async function clearRefreshToken() {
  await SecureStore.deleteItemAsync('refreshToken');
}
