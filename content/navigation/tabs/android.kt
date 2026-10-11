enum class Tab(val label: String, val icon: ImageVector) { // @link:tabdef
    Todos("Todos", Icons.Filled.Home), // @link:todos,todos-icon
    Settings("Settings", Icons.Filled.Settings), // @link:settings,settings-icon
}

@Composable
fun Tabs() {
    var selected by rememberSaveable { mutableStateOf(Tab.Todos) }

    Scaffold(
        bottomBar = {
            NavigationBar { // @link:bar
                Tab.entries.forEach { tab ->
                    NavigationBarItem( // @link:bar
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
            Tab.Todos -> TodosScreen(Modifier.padding(innerPadding)) // @link:todos-screen
            Tab.Settings -> SettingsScreen(Modifier.padding(innerPadding)) // @link:settings-screen
        }
    }
}
