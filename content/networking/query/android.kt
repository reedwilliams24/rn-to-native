data class TodosUiState( // @link:state
    val todos: List<Todo> = emptyList(),
    val refreshing: Boolean = false, // @link:refreshing
    val error: String? = null, // @link:error
)

class TodosViewModel(private val repo: TodoRepository) : ViewModel() { // @link:model
    private val refreshing = MutableStateFlow(false)
    private val error = MutableStateFlow<String?>(null)

    // repo.todos is the cache (a Room query, Chapter 13). The UI always shows it.
    val state: StateFlow<TodosUiState> = // @link:state
        combine(repo.todos, refreshing, error, ::TodosUiState)
            .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), TodosUiState())

    init { refresh() } // @link:load

    fun refresh() { // @link:refresh
        viewModelScope.launch {
            refreshing.value = true // @link:refreshing
            error.value = null
            try {
                repo.refresh() // fetch, write to the cache; the Flow emits // @link:fetch
            } catch (e: IOException) {
                error.value = "Offline. Showing saved todos." // @link:error
            } catch (e: HttpException) {
                error.value = "Server error (${e.code()})"
            } finally {
                refreshing.value = false
            }
        }
    }
}
