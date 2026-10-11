@OptIn(ExperimentalMaterial3Api::class) // PullToRefreshBox
@Composable
fun Feed(todos: List<Todo>, reload: suspend () -> Unit) { // @link:fn
    var refreshing by remember { mutableStateOf(false) } // @link:state
    val scope = rememberCoroutineScope()

    PullToRefreshBox( // @link:bind
        isRefreshing = refreshing, // @link:bind
        onRefresh = { // @link:handler
            scope.launch { // @link:handler
                refreshing = true // @link:start
                reload() // @link:reload
                refreshing = false // @link:end
            }
        },
    ) {
        LazyColumn(Modifier.fillMaxSize()) { // @link:list
            items(todos, key = { it.id }) { todo -> TodoRow(todo) } // @link:items
        }
    }
}
