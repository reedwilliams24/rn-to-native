sealed interface LoadState { // @link:type
    data object Loading : LoadState // @link:loading
    data class Success(val todos: List<Todo>) : LoadState // @link:success
    data class Error(val message: String) : LoadState // @link:error
}

fun label(state: LoadState): String = when (state) { // @link:fn,switch
    LoadState.Loading -> "Loading…" // @link:loading-case
    is LoadState.Success -> "${state.todos.size} todos" // @link:success-case
    is LoadState.Error -> "Error: ${state.message}" // @link:error-case
}
