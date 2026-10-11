import * as ImagePicker from 'expo-image-picker'; // @link:import

function AttachPhoto({ onPicked }: { onPicked: (uri: string) => void }) { // @link:fn
  async function pick() { // @link:pick
    const result = await ImagePicker.launchImageLibraryAsync({ // @link:launch
      mediaTypes: ['images'], // @link:images
    });
    if (!result.canceled) onPicked(result.assets[0].uri); // @link:picked
  }

  return <Button title="Attach photo" onPress={pick} />; // @link:button
}
