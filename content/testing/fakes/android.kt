data class Todo(val id: String, val title: String, val done: Boolean = false) // @link:model

// Production code depends on an interface… // @link:iface
interface TodoRepository { // @link:iface
    suspend fun load(): List<Todo> // @link:load
}

// …which the real app implements with Retrofit/Ktor (Chapter 12) // @link:impl
// and tests implement with a hand-written fake.
class FakeTodoRepository( // @link:fake
    private val result: Result<List<Todo>>, // @link:result
) : TodoRepository {
    var loadCalls = 0 // @link:calls
        private set

    override suspend fun load(): List<Todo> { // @link:fakeload
        loadCalls++ // @link:calls
        return result.getOrThrow() // @link:result
    }
}

// The dependency comes in through the constructor (Chapter 10) // @link:inject
class TodoListViewModel( // @link:inject
    private val repository: TodoRepository, // @link:inject
) : ViewModel() {
    // …
}
