private val HideCompleted = booleanPreferencesKey("hide_completed") // @link:key

@Composable
fun HideCompletedToggle(store: DataStore<Preferences>) { // @link:fn
    val hide by remember(store) { store.data.map { it[HideCompleted] ?: false } } // @link:state,read
        .collectAsStateWithLifecycle(initialValue = false)
    val scope = rememberCoroutineScope()

    Row(verticalAlignment = Alignment.CenterVertically) { // @link:row
        Text("Hide completed", modifier = Modifier.weight(1f)) // @link:label
        Switch( // @link:toggle
            checked = hide, // @link:toggle
            onCheckedChange = { value -> // @link:write
                scope.launch { store.edit { it[HideCompleted] = value } } // @link:write
            },
        )
    }
}
