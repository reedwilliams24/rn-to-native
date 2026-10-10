// Stateful wrapper: knows about the ViewModel
@Composable
fun TodoScreen(viewModel: TodoViewModel = viewModel()) {
    val todos by viewModel.todos.collectAsStateWithLifecycle()
    TodoList(todos = todos, onToggle = viewModel::toggle)
}

// Stateless content: plain data in, events out. Easy to preview and test.
@Composable
fun TodoList(todos: List<Todo>, onToggle: (String) -> Unit) {
    LazyColumn {
        items(todos, key = { it.id }) { todo ->
            TodoRow(title = todo.title, done = todo.done, onToggle = { onToggle(todo.id) })
        }
    }
}
