import { Linking } from 'react-native';
import { useCameraPermissions } from 'expo-camera';

function CameraGate({ children }: { children: React.ReactNode }) {
  const [permission, requestPermission] = useCameraPermissions();

  if (permission?.granted) return <>{children}</>;

  if (permission && !permission.canAskAgain) {
    return (
      <Button title="Enable camera in Settings" onPress={() => Linking.openSettings()} />
    );
  }

  return <Button title="Allow camera" onPress={requestPermission} />;
}
