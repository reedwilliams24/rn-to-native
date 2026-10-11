data class Todo(val id: String, val title: String, val done: Boolean = false) // @link:model

class TodoViewModel : ViewModel() { // @link:store
    // Private mutable state, public read-only view of it
    private val _todos = MutableStateFlow<List<Todo>>(emptyList()) // @link:todos
    val todos: StateFlow<List<Todo>> = _todos.asStateFlow() // @link:todos

    fun add(title: String) { // @link:add,add-sig
        _todos.update { it + Todo(id = UUID.randomUUID().toString(), title = title) } // @link:add
    }

    fun toggle(id: String) { // @link:toggle,toggle-sig
        _todos.update { list ->
            list.map { if (it.id == id) it.copy(done = !it.done) else it } // @link:toggle
        }
    }
}
