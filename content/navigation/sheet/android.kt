@OptIn(ExperimentalMaterial3Api::class) // ModalBottomSheet
@Composable
fun AddTodo() { // @link:fn
    var adding by rememberSaveable { mutableStateOf(false) } // @link:state

    Button(onClick = { adding = true }) { Text("New todo") } // @link:open

    // Shown while the state says so, like <Modal visible>
    if (adding) { // @link:modal
        ModalBottomSheet(onDismissRequest = { adding = false }) { // @link:modal,dismiss
            NewTodoForm(onDone = { adding = false }) // @link:form
        }
    }
}
