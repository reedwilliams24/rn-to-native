data class TodoGroup(val title: String, val todos: List<Todo>) // @link:type

@OptIn(ExperimentalFoundationApi::class) // stickyHeader
@Composable
fun TodoSections(groups: List<TodoGroup>) { // @link:fn
    LazyColumn { // @link:list
        groups.forEach { group -> // @link:groups
            stickyHeader(key = group.title) { // @link:header,sticky
                Text( // @link:header
                    text = group.title, // @link:header
                    style = MaterialTheme.typography.titleSmall,
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(MaterialTheme.colorScheme.surface) // opaque when pinned
                        .padding(horizontal = 16.dp, vertical = 8.dp),
                )
            }
            items(group.todos, key = { it.id }) { todo -> TodoRow(todo) } // @link:items
        }
    }
}
