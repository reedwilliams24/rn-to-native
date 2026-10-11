import * as Location from 'expo-location'; // @link:import

async function currentCoords() { // @link:fn
  const { granted } = await Location.requestForegroundPermissionsAsync(); // @link:ask
  if (!granted) return null; // @link:check

  const position = await Location.getCurrentPositionAsync({ // @link:fetch
    accuracy: Location.Accuracy.Balanced, // @link:accuracy
  });
  return position.coords; // @link:result
}
