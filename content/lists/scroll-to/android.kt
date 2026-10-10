@Composable
fun TodoListWithTop(todos: List<Todo>) {
    val listState = rememberLazyListState() // the "ref": scroll position + controls
    val scope = rememberCoroutineScope()

    Box(Modifier.fillMaxSize()) {
        LazyColumn(state = listState) {
            items(todos, key = { it.id }) { todo -> TodoRow(todo) }
        }
        SmallFloatingActionButton(
            // animateScrollToItem suspends until the animation finishes
            onClick = { scope.launch { listState.animateScrollToItem(0) } },
            modifier = Modifier.align(Alignment.BottomEnd).padding(16.dp),
        ) {
            Icon(Icons.Filled.KeyboardArrowUp, contentDescription = "Back to top")
        }
    }
}
