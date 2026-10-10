// modules/native-settings/index.ts
import { requireNativeModule } from 'expo-modules-core';

type NativeSettingsModule = {
  open(): Promise<void>;
};

export const NativeSettings = requireNativeModule<NativeSettingsModule>('NativeSettings');

// In an existing RN screen: the new screen is native, the rest is still RN
<Pressable onPress={() => NativeSettings.open()}>
  <Text>Settings</Text>
</Pressable>;
