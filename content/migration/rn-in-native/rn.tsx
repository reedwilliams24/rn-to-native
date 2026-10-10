// index.js of the RN bundle that ships inside the native app
import { AppRegistry } from 'react-native';
import { OrdersScreen } from './src/screens/OrdersScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

// Each legacy screen becomes its own root component.
// No NavigationContainer: the native app owns navigation now.
AppRegistry.registerComponent('Orders', () => OrdersScreen);
AppRegistry.registerComponent('Settings', () => SettingsScreen);
