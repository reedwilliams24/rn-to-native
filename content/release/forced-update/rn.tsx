import * as Updates from 'expo-updates';

// What you're giving up: shipping a JS fix without store review
export async function applyOtaUpdate() {
  const { isAvailable } = await Updates.checkForUpdateAsync();
  if (!isAvailable) return;

  await Updates.fetchUpdateAsync();
  await Updates.reloadAsync();
}

// What you'll need instead: a minimum-version gate from remote config // @link:gate
import * as Application from 'expo-application';

export function isUpdateRequired(minimumBuild: number) { // @link:check
  return Number(Application.nativeBuildVersion) < minimumBuild; // @link:compare
}
