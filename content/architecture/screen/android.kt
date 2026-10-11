// Stateful wrapper: knows about the ViewModel
@Composable
fun TodoScreen(viewModel: TodoViewModel = viewModel()) { // @link:screen
    val todos by viewModel.todos.collectAsStateWithLifecycle() // @link:read
    TodoList(todos = todos, onToggle = viewModel::toggle) // @link:pass
}

// Stateless content: plain data in, events out. Easy to preview and test.
@Composable
fun TodoList(todos: List<Todo>, onToggle: (String) -> Unit) { // @link:list
    LazyColumn { // @link:lazy
        items(todos, key = { it.id }) { todo -> // @link:lazy
            TodoRow(title = todo.title, done = todo.done, onToggle = { onToggle(todo.id) }) // @link:row
        }
    }
}
