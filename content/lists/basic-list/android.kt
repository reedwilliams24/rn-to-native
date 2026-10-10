@Composable
fun TodoList(todos: List<Todo>) {
    if (todos.isEmpty()) {
        Text("Nothing to do") // ListEmptyComponent is just an if
        return
    }
    LazyColumn {
        items(todos, key = { it.id }) { todo ->
            TodoRow(todo)
            HorizontalDivider()
        }
    }
}
