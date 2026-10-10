import { useCameraPermissions } from 'expo-camera';

function ScanButton({ onScan }: { onScan: () => void }) {
  const [permission, requestPermission] = useCameraPermissions();

  async function handlePress() {
    if (permission?.granted) return onScan();
    const result = await requestPermission();
    if (result.granted) onScan();
  }

  return <Button title="Scan receipt" onPress={handlePress} />;
}
