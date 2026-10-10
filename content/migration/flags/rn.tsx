// Whoever owns navigation owns the switch. Here the RN app is still the shell.
import { NativeSettings } from '../modules/native-settings';
import { flags } from './flags';

export function openSettings(navigation: Navigation) {
  if (flags.isEnabled('native_settings')) {
    NativeSettings.open(); // new native screen
  } else {
    navigation.navigate('Settings'); // existing RN screen
  }
}
