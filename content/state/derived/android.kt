@Composable
fun TodoSummary(todos: List<Todo>, query: String) { // @link:fn,props
    // Recalculated only when todos or query change, like useMemo's deps
    val visible = remember(todos, query) { // @link:memo
        todos.filter { it.title.contains(query, ignoreCase = true) } // @link:filter
    }
    val remaining = todos.count { !it.done } // cheap: no remember needed // @link:remaining

    Text("${visible.size} shown · $remaining left") // @link:text
}
