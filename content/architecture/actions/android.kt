enum class Filter { All, Open }

data class TodoUiState(
    val todos: List<Todo> = emptyList(),
    val filter: Filter = Filter.All,
) {
    val visible: List<Todo>
        get() = if (filter == Filter.Open) todos.filterNot { it.done } else todos
}

sealed interface TodoAction {
    data class Add(val title: String) : TodoAction
    data class Toggle(val id: String) : TodoAction
    data class SetFilter(val filter: Filter) : TodoAction
}

class TodoViewModel : ViewModel() {
    private val _state = MutableStateFlow(TodoUiState())
    val state: StateFlow<TodoUiState> = _state.asStateFlow()

    fun onAction(action: TodoAction) {
        _state.update { s ->
            when (action) {
                is TodoAction.Add -> s.copy(todos = s.todos + Todo(UUID.randomUUID().toString(), action.title))
                is TodoAction.Toggle -> s.copy(
                    todos = s.todos.map { if (it.id == action.id) it.copy(done = !it.done) else it },
                )
                is TodoAction.SetFilter -> s.copy(filter = action.filter)
            }
        }
    }
}
