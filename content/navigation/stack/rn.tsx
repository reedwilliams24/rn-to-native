type RootStack = { Home: undefined; Detail: { id: string } }; // @link:routes
const Stack = createNativeStackNavigator<RootStack>(); // @link:stack

function App() {
  return (
    <NavigationContainer>{/* @link:host */}
      <Stack.Navigator>{/* @link:host,start */}
        <Stack.Screen name="Home" component={HomeScreen} />{/* @link:home */}
        <Stack.Screen name="Detail" component={DetailScreen} />{/* @link:detail */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// HomeScreen:   navigation.navigate('Detail', { id: todo.id }) // @link:push
// DetailScreen: const { id } = route.params // @link:params
