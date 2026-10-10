enum class Tab(val label: String, val icon: ImageVector) {
    Todos("Todos", Icons.Filled.Home),
    Settings("Settings", Icons.Filled.Settings),
}

@Composable
fun Tabs() {
    var selected by rememberSaveable { mutableStateOf(Tab.Todos) }

    Scaffold(
        bottomBar = {
            NavigationBar {
                Tab.entries.forEach { tab ->
                    NavigationBarItem(
                        selected = tab == selected,
                        onClick = { selected = tab },
                        icon = { Icon(tab.icon, contentDescription = null) },
                        label = { Text(tab.label) },
                    )
                }
            }
        },
    ) { innerPadding ->
        when (selected) {
            Tab.Todos -> TodosScreen(Modifier.padding(innerPadding))
            Tab.Settings -> SettingsScreen(Modifier.padding(innerPadding))
        }
    }
}
