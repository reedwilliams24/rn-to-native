private val HideCompleted = booleanPreferencesKey("hide_completed")

@Composable
fun HideCompletedToggle(store: DataStore<Preferences>) {
    val hide by remember(store) { store.data.map { it[HideCompleted] ?: false } }
        .collectAsStateWithLifecycle(initialValue = false)
    val scope = rememberCoroutineScope()

    Row(verticalAlignment = Alignment.CenterVertically) {
        Text("Hide completed", modifier = Modifier.weight(1f))
        Switch(
            checked = hide,
            onCheckedChange = { value ->
                scope.launch { store.edit { it[HideCompleted] = value } }
            },
        )
    }
}
