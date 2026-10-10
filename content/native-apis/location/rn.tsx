import * as Location from 'expo-location';

async function currentCoords() {
  const { granted } = await Location.requestForegroundPermissionsAsync();
  if (!granted) return null;

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return position.coords;
}
