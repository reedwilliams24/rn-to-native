type RootStack = { Home: undefined; Detail: { id: string } };
const Stack = createNativeStackNavigator<RootStack>();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// HomeScreen:   navigation.navigate('Detail', { id: todo.id })
// DetailScreen: const { id } = route.params
