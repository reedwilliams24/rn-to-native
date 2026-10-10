data class TodoGroup(val title: String, val todos: List<Todo>)

@OptIn(ExperimentalFoundationApi::class) // stickyHeader
@Composable
fun TodoSections(groups: List<TodoGroup>) {
    LazyColumn {
        groups.forEach { group ->
            stickyHeader(key = group.title) {
                Text(
                    text = group.title,
                    style = MaterialTheme.typography.titleSmall,
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(MaterialTheme.colorScheme.surface) // opaque when pinned
                        .padding(horizontal = 16.dp, vertical = 8.dp),
                )
            }
            items(group.todos, key = { it.id }) { todo -> TodoRow(todo) }
        }
    }
}
