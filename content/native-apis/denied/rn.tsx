import { Linking } from 'react-native';
import { useCameraPermissions } from 'expo-camera';

function CameraGate({ children }: { children: React.ReactNode }) { // @link:fn
  const [permission, requestPermission] = useCameraPermissions(); // @link:status

  if (permission?.granted) return <>{children}</>; // @link:granted

  if (permission && !permission.canAskAgain) { // @link:denied
    return (
      <Button title="Enable camera in Settings" onPress={() => Linking.openSettings()} /> // @link:settings
    );
  }

  return <Button title="Allow camera" onPress={requestPermission} />; // @link:ask
}
