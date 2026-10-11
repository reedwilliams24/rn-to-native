class TodoListViewModel(private val dao: TodoDao) : ViewModel() { // @link:model
    // Room re-runs the query after every write and emits the new list
    val todos: StateFlow<List<TodoEntity>> = dao.observeAll() // @link:query,todos
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    fun add(title: String) { // @link:add
        viewModelScope.launch { dao.insert(TodoEntity(title = title)) } // @link:add
    }

    fun toggle(todo: TodoEntity) { // @link:toggle
        viewModelScope.launch { dao.update(todo.copy(done = !todo.done)) } // @link:toggle
    }
}

@Composable
fun TodoList(viewModel: TodoListViewModel) { // @link:screen
    val todos by viewModel.todos.collectAsStateWithLifecycle() // @link:todos

    LazyColumn { // @link:list
        items(todos, key = { it.id }) { todo ->
            TodoRow(title = todo.title, done = todo.done, onToggle = { viewModel.toggle(todo) }) // @link:row
        }
        item { Button(onClick = { viewModel.add("New todo") }) { Text("Add") } } // @link:addbtn
    }
}
