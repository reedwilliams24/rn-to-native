const Tab = createBottomTabNavigator(); // @link:tabdef

function Tabs() {
  return (
    <Tab.Navigator>{/* @link:bar */}
      <Tab.Screen // @link:todos
        name="Todos" // @link:todos
        component={TodosScreen} // @link:todos-screen
        options={{ tabBarIcon: ({ color }) => <Icon name="home" color={color} /> }} // @link:todos-icon
      />
      <Tab.Screen // @link:settings
        name="Settings" // @link:settings
        component={SettingsScreen} // @link:settings-screen
        options={{ tabBarIcon: ({ color }) => <Icon name="settings" color={color} /> }} // @link:settings-icon
      />
    </Tab.Navigator>
  );
}
