@Composable
fun SaveButton(todo: Todo, api: TodoApi) {
    // Cancelled automatically when SaveButton leaves the composition
    val scope = rememberCoroutineScope()
    var saving by remember { mutableStateOf(false) }

    Button(
        enabled = !saving,
        onClick = {
            scope.launch {
                saving = true
                try {
                    api.save(todo)
                } finally {
                    saving = false
                }
            }
        },
    ) {
        Text(if (saving) "Saving…" else "Save")
    }
}
