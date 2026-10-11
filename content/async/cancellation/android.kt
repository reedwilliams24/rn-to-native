@Composable
fun SearchResults(query: String, api: TodoApi) { // @link:fn
    var results by remember { mutableStateOf(emptyList<Todo>()) } // @link:state

    // A new query cancels the previous block, wherever it is suspended // @link:cancel
    LaunchedEffect(query) { // @link:effect
        delay(300) // debounce: cancellation interrupts the delay // @link:debounce
        results = api.search(query) // @link:search
    }

    LazyColumn { // @link:list
        items(results, key = { it.id }) { Text(it.title) } // @link:list
    }
}
