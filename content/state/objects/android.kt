data class Todo(val id: String, val title: String, val done: Boolean = false)

@Composable
fun Todos() {
    // Holds an immutable List. Changing it means assigning a new list.
    var todos by remember { mutableStateOf(listOf<Todo>()) }

    fun add(title: String) {
        todos = todos + Todo(id = UUID.randomUUID().toString(), title = title)
    }
    fun toggle(id: String) {
        todos = todos.map { if (it.id == id) it.copy(done = !it.done) else it }
    }

    Column {
        todos.forEach { todo ->
            Row(Modifier.clickable { toggle(todo.id) }) {
                Checkbox(checked = todo.done, onCheckedChange = null)
                Text(todo.title)
            }
        }
        Button(onClick = { add("New todo") }) { Text("Add") }
    }
}
