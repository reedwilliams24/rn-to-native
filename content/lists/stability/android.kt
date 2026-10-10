// Only vals of stable types, so Compose treats Todo as stable
data class Todo(val id: String, val title: String, val done: Boolean)

@Composable
fun TodoRow(todo: Todo, onToggle: (String) -> Unit) {
    Row(Modifier.clickable { onToggle(todo.id) }.padding(16.dp)) {
        Checkbox(checked = todo.done, onCheckedChange = null)
        Text(todo.title)
    }
}

@Composable
fun TodoList(todos: List<Todo>, onToggle: (String) -> Unit) {
    LazyColumn {
        items(todos, key = { it.id }) { todo ->
            // No memo or useCallback. If todo and onToggle are equal to last
            // time, this call is skipped automatically.
            TodoRow(todo, onToggle)
        }
    }
}
