struct Tabs: View {
    var body: some View {
        TabView { // @link:bar,tabdef
            // Each tab gets its own stack, like a nested stack navigator
            NavigationStack { TodosScreen() } // @link:todos-screen
                .tabItem { Label("Todos", systemImage: "house") } // @link:todos,todos-icon
            NavigationStack { SettingsScreen() } // @link:settings-screen
                .tabItem { Label("Settings", systemImage: "gear") } // @link:settings,settings-icon
        }
    }
}
