const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Todos"
        component={TodosScreen}
        options={{ tabBarIcon: ({ color }) => <Icon name="home" color={color} /> }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarIcon: ({ color }) => <Icon name="settings" color={color} /> }}
      />
    </Tab.Navigator>
  );
}
