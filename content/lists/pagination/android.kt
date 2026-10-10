@Composable
fun InfiniteList(todos: List<Todo>, loading: Boolean, loadMore: () -> Unit) {
    val listState = rememberLazyListState()

    // True when the last visible item is within 5 of the end
    val nearEnd by remember {
        derivedStateOf {
            val info = listState.layoutInfo
            val last = info.visibleItemsInfo.lastOrNull()?.index ?: 0
            last >= info.totalItemsCount - 5
        }
    }
    // Re-check after each page arrives, in case we're still near the end
    LaunchedEffect(nearEnd, todos.size) {
        if (nearEnd && !loading) loadMore()
    }

    LazyColumn(state = listState) {
        items(todos, key = { it.id }) { todo -> TodoRow(todo) }
        if (loading) {
            item { CircularProgressIndicator(Modifier.padding(16.dp)) }
        }
    }
}
