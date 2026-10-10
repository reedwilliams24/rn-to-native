data class Todo(val id: String, val title: String, val done: Boolean = false)

class TodoViewModel : ViewModel() {
    // Private mutable state, public read-only view of it
    private val _todos = MutableStateFlow<List<Todo>>(emptyList())
    val todos: StateFlow<List<Todo>> = _todos.asStateFlow()

    fun add(title: String) {
        _todos.update { it + Todo(id = UUID.randomUUID().toString(), title = title) }
    }

    fun toggle(id: String) {
        _todos.update { list ->
            list.map { if (it.id == id) it.copy(done = !it.done) else it }
        }
    }
}
