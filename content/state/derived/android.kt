@Composable
fun TodoSummary(todos: List<Todo>, query: String) {
    // Recalculated only when todos or query change, like useMemo's deps
    val visible = remember(todos, query) {
        todos.filter { it.title.contains(query, ignoreCase = true) }
    }
    val remaining = todos.count { !it.done } // cheap: no remember needed

    Text("${visible.size} shown · $remaining left")
}
