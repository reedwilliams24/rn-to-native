@OptIn(ExperimentalMaterial3Api::class) // PullToRefreshBox
@Composable
fun Feed(todos: List<Todo>, reload: suspend () -> Unit) {
    var refreshing by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    PullToRefreshBox(
        isRefreshing = refreshing,
        onRefresh = {
            scope.launch {
                refreshing = true
                reload()
                refreshing = false
            }
        },
    ) {
        LazyColumn(Modifier.fillMaxSize()) {
            items(todos, key = { it.id }) { todo -> TodoRow(todo) }
        }
    }
}
