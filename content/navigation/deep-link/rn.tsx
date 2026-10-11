const linking: LinkingOptions<RootStack> = { // @link:config
  prefixes: ['myapp://', 'https://example.com'], // @link:prefixes
  config: {
    screens: {
      Detail: 'todo/:id', // @link:route
    },
  },
};

function App() {
  return <NavigationContainer linking={linking}>{/* … */}</NavigationContainer>; // @link:register
}
