type Routes = {
  Inbox: undefined;
  Message: { id: string };
};
const Stack = createNativeStackNavigator<Routes>();
type Props<R extends keyof Routes> =
  NativeStackScreenProps<Routes, R>;

function Inbox({ navigation }: Props<"Inbox">) {
  return (
    <Button
      title="Open"
      onPress={() =>
        navigation.navigate("Message", { id: "a" })
      }
    />
  );
}

function Message({ route, navigation }: Props<"Message">) {
  return (
    <View>
      <Text>Message {route.params.id}</Text>
      <Button
        title="Back"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

function MailApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Inbox" component={Inbox} />
        <Stack.Screen name="Message" component={Message} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
