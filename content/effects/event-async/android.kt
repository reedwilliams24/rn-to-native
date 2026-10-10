@Composable
fun SaveButton(todo: Todo) {
    var saving by remember { mutableStateOf(false) }
    // Coroutines launched here are cancelled when SaveButton leaves
    val scope = rememberCoroutineScope()

    Button(
        enabled = !saving,
        onClick = {
            scope.launch {
                saving = true
                try {
                    saveTodo(todo)
                } finally {
                    saving = false
                }
            }
        },
    ) {
        Text(if (saving) "Saving…" else "Save")
    }
}
