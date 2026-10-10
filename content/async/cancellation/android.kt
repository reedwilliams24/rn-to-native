@Composable
fun SearchResults(query: String, api: TodoApi) {
    var results by remember { mutableStateOf(emptyList<Todo>()) }

    // A new query cancels the previous block, wherever it is suspended
    LaunchedEffect(query) {
        delay(300) // debounce: cancellation interrupts the delay
        results = api.search(query)
    }

    LazyColumn {
        items(results, key = { it.id }) { Text(it.title) }
    }
}
