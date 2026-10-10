data class Todo(val id: String, val title: String, val done: Boolean = false)

// Production code depends on an interface…
interface TodoRepository {
    suspend fun load(): List<Todo>
}

// …which the real app implements with Retrofit/Ktor (Chapter 12)
// and tests implement with a hand-written fake.
class FakeTodoRepository(
    private val result: Result<List<Todo>>,
) : TodoRepository {
    var loadCalls = 0
        private set

    override suspend fun load(): List<Todo> {
        loadCalls++
        return result.getOrThrow()
    }
}

// The dependency comes in through the constructor (Chapter 10)
class TodoListViewModel(
    private val repository: TodoRepository,
) : ViewModel() {
    // …
}
