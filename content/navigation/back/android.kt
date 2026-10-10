@Composable
fun EditScreen(onBack: () -> Unit) {
    var dirty by rememberSaveable { mutableStateOf(false) }
    var confirming by remember { mutableStateOf(false) }

    // Intercepts the system back button and gesture while enabled
    BackHandler(enabled = dirty) { confirming = true }

    if (confirming) {
        AlertDialog(
            onDismissRequest = { confirming = false },
            title = { Text("Discard changes?") },
            confirmButton = { TextButton(onClick = onBack) { Text("Discard") } },
            dismissButton = {
                TextButton(onClick = { confirming = false }) { Text("Keep editing") }
            },
        )
    }

    EditForm(onChange = { dirty = true })
}
