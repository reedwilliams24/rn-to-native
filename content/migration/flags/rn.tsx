// Whoever owns navigation owns the switch. Here the RN app is still the shell. // @link:shell
import { NativeSettings } from '../modules/native-settings';
import { flags } from './flags';

export function openSettings(navigation: Navigation) { // @link:fn
  if (flags.isEnabled('native_settings')) { // @link:check
    NativeSettings.open(); // new native screen // @link:new
  } else {
    navigation.navigate('Settings'); // existing RN screen // @link:legacy
  }
}
