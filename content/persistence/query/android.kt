class TodoListViewModel(private val dao: TodoDao) : ViewModel() {
    // Room re-runs the query after every write and emits the new list
    val todos: StateFlow<List<TodoEntity>> = dao.observeAll()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    fun add(title: String) {
        viewModelScope.launch { dao.insert(TodoEntity(title = title)) }
    }

    fun toggle(todo: TodoEntity) {
        viewModelScope.launch { dao.update(todo.copy(done = !todo.done)) }
    }
}

@Composable
fun TodoList(viewModel: TodoListViewModel) {
    val todos by viewModel.todos.collectAsStateWithLifecycle()

    LazyColumn {
        items(todos, key = { it.id }) { todo ->
            TodoRow(title = todo.title, done = todo.done, onToggle = { viewModel.toggle(todo) })
        }
        item { Button(onClick = { viewModel.add("New todo") }) { Text("Add") } }
    }
}
