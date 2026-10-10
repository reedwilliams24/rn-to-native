struct Tabs: View {
    var body: some View {
        TabView {
            // Each tab gets its own stack, like a nested stack navigator
            NavigationStack { TodosScreen() }
                .tabItem { Label("Todos", systemImage: "house") }
            NavigationStack { SettingsScreen() }
                .tabItem { Label("Settings", systemImage: "gear") }
        }
    }
}
