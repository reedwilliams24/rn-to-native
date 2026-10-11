// modules/native-settings/index.ts // @link:file
import { requireNativeModule } from 'expo-modules-core';

type NativeSettingsModule = {
  open(): Promise<void>; // @link:open
};

export const NativeSettings = requireNativeModule<NativeSettingsModule>('NativeSettings'); // @link:name

// In an existing RN screen: the new screen is native, the rest is still RN
<Pressable onPress={() => NativeSettings.open()}>
  <Text>Settings</Text>
</Pressable>;
