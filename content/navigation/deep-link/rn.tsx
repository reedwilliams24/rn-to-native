const linking: LinkingOptions<RootStack> = {
  prefixes: ['myapp://', 'https://example.com'],
  config: {
    screens: {
      Detail: 'todo/:id',
    },
  },
};

function App() {
  return <NavigationContainer linking={linking}>{/* … */}</NavigationContainer>;
}
