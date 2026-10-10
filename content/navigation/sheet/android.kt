@OptIn(ExperimentalMaterial3Api::class) // ModalBottomSheet
@Composable
fun AddTodo() {
    var adding by rememberSaveable { mutableStateOf(false) }

    Button(onClick = { adding = true }) { Text("New todo") }

    // Shown while the state says so, like <Modal visible>
    if (adding) {
        ModalBottomSheet(onDismissRequest = { adding = false }) {
            NewTodoForm(onDone = { adding = false })
        }
    }
}
