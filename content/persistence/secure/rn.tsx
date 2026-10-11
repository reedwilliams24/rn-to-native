// expo-secure-store wraps Keystore (Android) and Keychain (iOS) // @link:platform
async function saveRefreshToken(token: string) { // @link:save
  await SecureStore.setItemAsync('refreshToken', token); // @link:save
}

async function readRefreshToken(): Promise<string | null> { // @link:read
  return SecureStore.getItemAsync('refreshToken'); // @link:read
}

async function clearRefreshToken() { // @link:delete
  await SecureStore.deleteItemAsync('refreshToken'); // @link:delete
}
