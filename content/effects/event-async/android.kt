@Composable
fun SaveButton(todo: Todo) { // @link:fn
    var saving by remember { mutableStateOf(false) } // @link:state
    // Coroutines launched here are cancelled when SaveButton leaves
    val scope = rememberCoroutineScope() // @link:scope

    Button( // @link:button
        enabled = !saving, // @link:disabled
        onClick = { // @link:handler
            scope.launch { // @link:handler,scope
                saving = true // @link:start
                try { // @link:try
                    saveTodo(todo) // @link:save
                } finally { // @link:finally
                    saving = false // @link:finish
                }
            }
        },
    ) {
        Text(if (saving) "Saving…" else "Save") // @link:label
    }
}
