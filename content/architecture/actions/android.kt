enum class Filter { All, Open } // @link:filter

data class TodoUiState( // @link:state
    val todos: List<Todo> = emptyList(),
    val filter: Filter = Filter.All,
) {
    val visible: List<Todo> // @link:visible
        get() = if (filter == Filter.Open) todos.filterNot { it.done } else todos // @link:visible
}

sealed interface TodoAction { // @link:action
    data class Add(val title: String) : TodoAction // @link:add
    data class Toggle(val id: String) : TodoAction // @link:toggle
    data class SetFilter(val filter: Filter) : TodoAction // @link:setfilter
}

class TodoViewModel : ViewModel() {
    private val _state = MutableStateFlow(TodoUiState())
    val state: StateFlow<TodoUiState> = _state.asStateFlow()

    fun onAction(action: TodoAction) { // @link:reduce
        _state.update { s ->
            when (action) { // @link:switch
                is TodoAction.Add -> s.copy(todos = s.todos + Todo(UUID.randomUUID().toString(), action.title)) // @link:add-case
                is TodoAction.Toggle -> s.copy( // @link:toggle-case
                    todos = s.todos.map { if (it.id == action.id) it.copy(done = !it.done) else it }, // @link:toggle-case
                )
                is TodoAction.SetFilter -> s.copy(filter = action.filter) // @link:filter-case
            }
        }
    }
}
