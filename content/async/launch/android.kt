@Composable
fun SaveButton(todo: Todo, api: TodoApi) { // @link:fn
    // Cancelled automatically when SaveButton leaves the composition
    val scope = rememberCoroutineScope() // @link:scope
    var saving by remember { mutableStateOf(false) } // @link:state

    Button( // @link:button
        enabled = !saving, // @link:disabled
        onClick = { // @link:handler
            scope.launch { // @link:handler,scope
                saving = true // @link:start
                try { // @link:try
                    api.save(todo) // @link:save
                } finally { // @link:finally
                    saving = false // @link:finish
                }
            }
        },
    ) {
        Text(if (saving) "Saving…" else "Save") // @link:label
    }
}
