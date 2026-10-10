data class TodosUiState(
    val todos: List<Todo> = emptyList(),
    val refreshing: Boolean = false,
    val error: String? = null,
)

class TodosViewModel(private val repo: TodoRepository) : ViewModel() {
    private val refreshing = MutableStateFlow(false)
    private val error = MutableStateFlow<String?>(null)

    // repo.todos is the cache (a Room query, Chapter 13). The UI always shows it.
    val state: StateFlow<TodosUiState> =
        combine(repo.todos, refreshing, error, ::TodosUiState)
            .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), TodosUiState())

    init { refresh() }

    fun refresh() {
        viewModelScope.launch {
            refreshing.value = true
            error.value = null
            try {
                repo.refresh() // fetch, write to the cache; the Flow emits
            } catch (e: IOException) {
                error.value = "Offline. Showing saved todos."
            } catch (e: HttpException) {
                error.value = "Server error (${e.code()})"
            } finally {
                refreshing.value = false
            }
        }
    }
}
