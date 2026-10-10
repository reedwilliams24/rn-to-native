// index.ts: the JS entry Metro bundles
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);

// App.tsx: the root component
export default function App() {
  return (
    <ThemeProvider>
      <TodoScreen />
    </ThemeProvider>
  );
}
