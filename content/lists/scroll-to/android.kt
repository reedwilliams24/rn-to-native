@Composable
fun TodoListWithTop(todos: List<Todo>) { // @link:fn
    val listState = rememberLazyListState() // the "ref": scroll position + controls // @link:ref
    val scope = rememberCoroutineScope() // @link:scroll

    Box(Modifier.fillMaxSize()) { // @link:container
        LazyColumn(state = listState) { // @link:list,ref
            items(todos, key = { it.id }) { todo -> TodoRow(todo) } // @link:items
        }
        SmallFloatingActionButton( // @link:button
            // animateScrollToItem suspends until the animation finishes
            onClick = { scope.launch { listState.animateScrollToItem(0) } }, // @link:scroll
            modifier = Modifier.align(Alignment.BottomEnd).padding(16.dp), // @link:pos
        ) {
            Icon(Icons.Filled.KeyboardArrowUp, contentDescription = "Back to top") // @link:icon
        }
    }
}
