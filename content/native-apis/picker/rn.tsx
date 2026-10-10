import * as ImagePicker from 'expo-image-picker';

function AttachPhoto({ onPicked }: { onPicked: (uri: string) => void }) {
  async function pick() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
    });
    if (!result.canceled) onPicked(result.assets[0].uri);
  }

  return <Button title="Attach photo" onPress={pick} />;
}
