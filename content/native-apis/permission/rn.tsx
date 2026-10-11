import { useCameraPermissions } from 'expo-camera';

function ScanButton({ onScan }: { onScan: () => void }) { // @link:fn
  const [permission, requestPermission] = useCameraPermissions(); // @link:status

  async function handlePress() { // @link:press
    if (permission?.granted) return onScan(); // @link:granted
    const result = await requestPermission(); // @link:ask
    if (result.granted) onScan(); // @link:asked-ok
  }

  return <Button title="Scan receipt" onPress={handlePress} />; // @link:button
}
