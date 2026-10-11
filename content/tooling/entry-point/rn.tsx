// index.ts: the JS entry Metro bundles // @link:entry
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App); // @link:register

// App.tsx: the root component // @link:root
export default function App() { // @link:root
  return (
    <ThemeProvider>{/* @link:theme */}
      <TodoScreen />{/* @link:screen */}
    </ThemeProvider>
  );
}
