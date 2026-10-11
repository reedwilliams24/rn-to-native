@Composable
fun EditScreen(onBack: () -> Unit) { // @link:fn
    var dirty by rememberSaveable { mutableStateOf(false) } // @link:dirty
    var confirming by remember { mutableStateOf(false) } // @link:confirm

    // Intercepts the system back button and gesture while enabled
    BackHandler(enabled = dirty) { confirming = true } // @link:intercept,guard

    if (confirming) {
        AlertDialog( // @link:dialog
            onDismissRequest = { confirming = false },
            title = { Text("Discard changes?") }, // @link:dialog
            confirmButton = { TextButton(onClick = onBack) { Text("Discard") } }, // @link:discard
            dismissButton = {
                TextButton(onClick = { confirming = false }) { Text("Keep editing") } // @link:keep
            },
        )
    }

    EditForm(onChange = { dirty = true }) // @link:form
}
