sealed interface LoadState {
    data object Loading : LoadState
    data class Success(val todos: List<Todo>) : LoadState
    data class Error(val message: String) : LoadState
}

fun label(state: LoadState): String = when (state) {
    LoadState.Loading -> "Loading…"
    is LoadState.Success -> "${state.todos.size} todos"
    is LoadState.Error -> "Error: ${state.message}"
}
