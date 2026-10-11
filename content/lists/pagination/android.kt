@Composable
fun InfiniteList(todos: List<Todo>, loading: Boolean, loadMore: () -> Unit) { // @link:fn,props
    val listState = rememberLazyListState()

    // True when the last visible item is within 5 of the end
    val nearEnd by remember { // @link:threshold
        derivedStateOf {
            val info = listState.layoutInfo
            val last = info.visibleItemsInfo.lastOrNull()?.index ?: 0
            last >= info.totalItemsCount - 5 // @link:threshold
        }
    }
    // Re-check after each page arrives, in case we're still near the end
    LaunchedEffect(nearEnd, todos.size) { // @link:trigger
        if (nearEnd && !loading) loadMore() // @link:trigger
    }

    LazyColumn(state = listState) { // @link:list
        items(todos, key = { it.id }) { todo -> TodoRow(todo) } // @link:items,row
        if (loading) { // @link:footer
            item { CircularProgressIndicator(Modifier.padding(16.dp)) } // @link:footer
        }
    }
}
